import { IsString } from 'class-validator';

export class Logout {
  @IsString()
  token: string;
}
