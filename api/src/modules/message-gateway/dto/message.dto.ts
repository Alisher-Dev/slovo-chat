import { IsNumber, IsString } from 'class-validator';

export class sendMessage {
  @IsString()
  text: string;

  @IsNumber()
  chatId: number;

  @IsNumber()
  senderId: number;
}

export class updateMessage {
  @IsNumber()
  id: number;

  @IsString()
  text: string;
}
