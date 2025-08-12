import { IsEmail, IsOptional, IsString } from 'class-validator';

export class CreateDto {
  @IsString()
  username: string;

  @IsString()
  password: string;

  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  avatar?: string;
}
