import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateDto } from './dto/create.dto';
import { Prisma } from 'src/prisma.service';
import { compareSync, hashSync } from 'bcrypt';
import token from 'src/common/helpers/token';
import { LoginDto } from './dto/login.dto';
import { Logout } from './dto/logout.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: Prisma) {}

  async create(createDto: CreateDto) {
    const emailcheck = await this.prisma.user.findUnique({
      where: { email: createDto.email },
    });

    if (!!emailcheck) throw new UnauthorizedException('email exists');

    const hashPassword = hashSync(createDto.password, 10);

    const user = await this.prisma.user.create({
      data: { ...createDto, password: hashPassword },
    });

    const accessToken = token.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = token.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { token: refreshToken },
    });

    return { accessToken, refreshToken };
  }

  async login(loginDto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: loginDto.email, status: true },
    });

    if (!user) throw new NotFoundException('user not found');

    const checkPassword = compareSync(loginDto.password, user.password);

    if (!checkPassword) throw new BadRequestException('password is invalid');

    const accessToken = token.generateAccessToken({
      id: user.id,
      email: user.email,
    });
    const refreshToken = token.generateRefreshToken({
      id: user.id,
      email: user.email,
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { token: refreshToken, status: true },
    });

    return { accessToken, refreshToken };
  }

  async Logout(logout: Logout) {
    const { email, id } = token.verifyAccessToken(logout.token);

    const user = await this.prisma.user.findFirst({
      where: { id, email, status: true },
    });

    if (!user) throw new NotFoundException('user not found');

    await this.prisma.user.update({
      where: { id },
      data: { token: null },
    });

    return { email, id };
  }
}
