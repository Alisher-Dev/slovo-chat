import { Injectable, UnauthorizedException } from '@nestjs/common';
import { sign, verify } from 'jsonwebtoken';
import { env } from 'src/config/env.config';
import { IPayload } from 'src/types/type';

@Injectable()
class token {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpire: string;
  private readonly refreshExpire: string;

  constructor() {
    this.accessSecret = env.jwt.accessSecret;
    this.refreshSecret = env.jwt.refreshSecret;
    this.accessExpire = env.jwt.accessExpire;
    this.refreshExpire = env.jwt.refreshExpire;
  }

  generateAccessToken(payload: IPayload): string {
    return sign(payload, this.accessSecret, { expiresIn: this.accessExpire });
  }

  generateRefreshToken(payload: IPayload): string {
    return sign(payload, this.refreshSecret, { expiresIn: this.refreshExpire });
  }

  verifyAccessToken(accessToken: string) {
    try {
      return verify(accessToken, this.accessSecret) as IPayload;
    } catch (error) {
      throw new UnauthorizedException('token involid');
    }
  }

  verifyRefreshToken(refreshToken: string) {
    try {
      return verify(refreshToken, this.refreshSecret) as IPayload;
    } catch (error) {
      throw new UnauthorizedException('token involid');
    }
  }
}

export default new token();
