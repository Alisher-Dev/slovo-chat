import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Prisma } from 'src/prisma.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, Prisma],
})
export class UsersModule {}
