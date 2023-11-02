import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import {
  InjectJwtConfig,
  JwtConfiguration,
} from '@moreloja/api/configurations';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(@InjectJwtConfig() jwtConfiguration: JwtConfiguration) {
    super({
      jwtFromRequest: (request: Request) => {
        if (!request || !request.cookies) return null;
        return request.cookies[jwtConfiguration.refreshTokenCookieName];
      },
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.refreshTokenSecret,
    });
  }

  async validate(data: any): Promise<any> {
    return data;
  }
}
