import { Module } from '@nestjs/common';
import { UsersModule } from './modules/users/users.module';
import { MessagesGateway } from './modules/message-gateway/message.gateway';
import { Prisma } from './prisma.service';

@Module({
  imports: [UsersModule],
  providers: [MessagesGateway, Prisma],
})
export class AppModule {}
