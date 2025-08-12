import { Controller, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateDto } from './dto/create.dto';
import { ApiResponse } from 'src/common/helpers/apiResponce';
import { LoginDto } from './dto/login.dto';
import { Logout } from './dto/logout.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateDto) {
    const data = await this.usersService.create(createUserDto);
    return new ApiResponse(data);
  }

  @Post('login')
  async login(@Body() createUserDto: LoginDto) {
    const data = await this.usersService.login(createUserDto);
    return new ApiResponse(data);
  }

  @Post('logout')
  async logout(@Body() logout: Logout) {
    const data = await this.usersService.Logout(logout);
    return new ApiResponse(data);
  }
}
