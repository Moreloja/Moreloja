import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const jwtConfiguration = registerAs('jwt', () => {
  return {
    accessTokenCookieName:
      process.env['JWT_ACCESS_TOKEN_COOKIE_NAME'] || 'AccessToken',
    accessTokenSecret:
      process.env['JWT_ACCESS_TOKEN_SECRET'] || 'Super Secret String',
    accessTokenExpiresIn:
      Number(process.env['JWT_ACCESS_TOKEN_EXPIRES_IN']) || 1000 * 60 * 15, // 15 Minutes
    refreshTokenCookieName:
      process.env['JWT_REFRESH_TOKEN_COOKIE_NAME'] || 'RefreshToken',
    refreshTokenSecret:
      process.env['JWT_REFRESH_TOKEN_SECRET'] || 'Super Secret Refresh String',
    refreshTokenExpiresIn:
      Number(process.env['JWT_REFRESH_TOKEN_EXPIRES_IN']) ||
      1000 * 60 * 60 * 24 * 7, // 7 Days
  };
});

export type JwtConfiguration = ConfigType<typeof jwtConfiguration>;

export const InjectJwtConfig = () => Inject(jwtConfiguration.KEY);
