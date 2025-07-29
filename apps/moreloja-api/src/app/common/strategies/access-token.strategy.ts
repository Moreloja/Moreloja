import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import {
  InjectJwtConfig,
  JwtConfiguration,
} from '@moreloja/api/configurations';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(@InjectJwtConfig() jwtConfiguration: JwtConfiguration) {
    super({
      jwtFromRequest: (request: Request) => {
        if (!request || !request.cookies) return null;
        return request.cookies[jwtConfiguration.accessTokenCookieName];
      },
      ignoreExpiration: false,
      secretOrKey: jwtConfiguration.accessTokenSecret,
    });
  }

  async validate(data: any): Promise<any> {
    return data;
  }
}
