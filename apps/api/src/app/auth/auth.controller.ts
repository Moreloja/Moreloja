import { Body, Controller, Post, Res, UseGuards } from '@nestjs/common';
import { CookieOptions, Request, Response } from 'express';

import { AccessTokens, AuthService } from '@moreloja/api/data-access-services';
import { LoginRequest } from '@moreloja/api/data-access-dtos';
import {
  InjectJwtConfig,
  JwtConfiguration,
} from '@moreloja/api/configurations';

import { AccessTokenGuard } from '../common/guards';

@Controller()
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @InjectJwtConfig()
    private readonly jwtConfiguration: JwtConfiguration,
  ) {}

  @Post('auth/login')
  async loginTwoFactor(
    @Body() loginRequest: LoginRequest,
    @Res({ passthrough: true }) response: Response,
  ): Promise<void> {
    const accessTokens = await this.authService.login(loginRequest);
    this.setAccessTokenCookies(response, accessTokens);
  }

  // TODO refresh token

  @Post('auth/logout')
  @UseGuards(AccessTokenGuard)
  async logout(@Res({ passthrough: true }) response: Response): Promise<void> {
    await this.authService.logout();
    // TODO domain?
    // TODO httpOnly?
    const options: CookieOptions = { sameSite: 'strict', secure: true };
    response.clearCookie(this.jwtConfiguration.accessTokenCookieName, options);
    response.clearCookie(this.jwtConfiguration.refreshTokenCookieName, options);
  }

  private setAccessTokenCookies(
    response: Response,
    tokens: AccessTokens,
  ): void {
    const options: CookieOptions = {
      domain: 'localhost', // TODO your domain here!
      httpOnly: true,
      sameSite: 'strict',
      secure: true,
    };
    response.cookie(
      this.jwtConfiguration.accessTokenCookieName,
      tokens.accessToken,
      {
        ...options,
        expires: new Date(
          Date.now() + this.jwtConfiguration.accessTokenExpiresIn,
        ),
      },
    );
    response.cookie(
      this.jwtConfiguration.refreshTokenCookieName,
      tokens.refreshToken,
      {
        ...options,
        expires: new Date(
          Date.now() + this.jwtConfiguration.refreshTokenExpiresIn,
        ),
      },
    );
  }
}
