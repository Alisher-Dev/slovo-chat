import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Prisma } from 'src/prisma.service';
import { sendMessage, updateMessage } from './dto/message.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class MessagesGateway {
  constructor(private prisma: Prisma) {}

  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  // CRUD по сокету
  @SubscribeMessage('createMessage')
  async create(@MessageBody() data: sendMessage) {
    const message = await this.prisma.message.create({ data });
    this.server.to(`chat_${data.chatId}`).emit('messageCreated', message);
    return message;
  }

  @SubscribeMessage('getMessages')
  async findAll(@MessageBody() chatId: number) {
    return this.prisma.message.findMany({
      where: { chatId },
      orderBy: { createdAt: 'asc' },
    });
  }

  @SubscribeMessage('updateMessage')
  async update(@MessageBody() data: updateMessage) {
    const updated = await this.prisma.message.update({
      where: { id: data.id },
      data: { text: data.text },
    });
    this.server.emit('messageUpdated', updated);
    return updated;
  }

  @SubscribeMessage('deleteMessage')
  async remove(@MessageBody() id: number) {
    const deleted = await this.prisma.message.delete({ where: { id } });
    this.server.emit('messageDeleted', deleted.id);
    return deleted;
  }

  @SubscribeMessage('joinChat')
  joinChat(@MessageBody() chatId: number, @ConnectedSocket() client: Socket) {
    client.join(`chat_${chatId}`);
    return { joined: chatId };
  }
}
