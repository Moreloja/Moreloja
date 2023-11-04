import { ForbiddenException, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import * as OTPAuth from 'otpauth';

import { AuthRepository } from '@moreloja/api/data-access-repositories';
import { LoginRequest } from '@moreloja/api/data-access-dtos';
import { AdminUser } from '@moreloja/shared/global-constants';
import { Auth } from '@moreloja/api/data-access-models';
import {
  InjectJwtConfig,
  JwtConfiguration,
} from '@moreloja/api/configurations';

import { AccessTokens } from './types/access-tokens';

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    @InjectJwtConfig()
    private readonly jwtConfiguration: JwtConfiguration,
  ) {}

  async ensureAdminExists(): Promise<void> {
    const userInDb = await this.authRepository.findUser();
    if (userInDb === null) {
      Logger.log('No admin user found.');
      await this.registerAdmin();
    }
  }

  private async registerAdmin(): Promise<void> {
    const password = this.getRandomPassword();
    const twoFactorSecret = this.getRandomTwoFactorSecret();

    await this.authRepository.createUser(
      await this.hashData(password),
      twoFactorSecret,
    );

    Logger.log('Creating admin user...');
    Logger.log('Generated password: ' + password);
    Logger.log('Generated two factor secret: ' + twoFactorSecret);
  }

  private getRandomPassword(): string {
    return Math.random().toString(36).substring(2, 12);
  }

  async login(request: LoginRequest): Promise<AccessTokens> {
    const user = await this.authRepository.findUser();
    if (user !== null) {
      if (await this.passwordIsCorrect(user.password, request.password)) {
        if (await this.twoFactorTokenIsCorrect(user, request.twoFactorToken)) {
          return await this.createTokens(AdminUser);
        }
      }
    }

    throw new ForbiddenException('Access Denied!');
  }

  async refreshTokens(refreshToken: string): Promise<AccessTokens> {
    const user = await this.authRepository.findUser();
    if (
      user !== null &&
      user.refreshTokenHash !== null &&
      user.refreshTokenHash !== undefined
    ) {
      const refreshTokenMatches = await argon2.verify(
        user.refreshTokenHash,
        refreshToken,
      );
      if (refreshTokenMatches) {
        return await this.createTokens(AdminUser);
      }
    }

    throw new ForbiddenException('Access Denied!');
  }

  async logout() {
    this.authRepository.updateRefreshToken('');
  }

  private async createTokens(userName: string): Promise<AccessTokens> {
    const accessToken = await this.jwtService.signAsync(
      {
        sub: userName,
      },
      {
        secret: this.jwtConfiguration.accessTokenSecret,
        expiresIn: this.jwtConfiguration.accessTokenExpiresIn / 1000,
      },
    );

    const refreshToken = await this.jwtService.signAsync(
      {
        sub: userName,
      },
      {
        secret: this.jwtConfiguration.refreshTokenSecret,
        expiresIn: this.jwtConfiguration.refreshTokenExpiresIn / 1000,
      },
    );

    await this.authRepository.updateRefreshToken(
      await this.hashData(refreshToken),
    );

    return {
      accessToken,
      refreshToken,
    };
  }

  private async passwordIsCorrect(
    passwordHash: string,
    password: string,
  ): Promise<boolean> {
    return await argon2.verify(passwordHash, password);
  }

  private async twoFactorTokenIsCorrect(
    auth: Auth,
    twoFactorToken: string,
  ): Promise<boolean> {
    const token = this.otpGenerate(auth.twoFactorSecret);
    Logger.debug('Two factor token: ' + token);

    const isValid = this.otpValidate(auth.twoFactorSecret, twoFactorToken);
    return isValid;
  }

  private hashData(data: string): Promise<string> {
    return argon2.hash(data);
  }

  private otpOptions = {
    issuer: 'ACME',
    label: 'AzureDiamond',
    algorithm: 'SHA1',
    digits: 6,
    period: 30,
  };

  private otpGenerate(twoFactorSecret: string): string {
    if (twoFactorSecret !== null) {
      const otpAuth = new OTPAuth.TOTP({
        ...this.otpOptions,
        secret: twoFactorSecret,
      });
      return otpAuth.generate();
    } else {
      const otpAuth = new OTPAuth.TOTP(this.otpOptions);
      return otpAuth.generate();
    }
  }

  private otpValidate(
    twoFactorSecret: string,
    twoFactorToken: string,
  ): boolean {
    const otpAuth = new OTPAuth.TOTP({
      ...this.otpOptions,
      secret: twoFactorSecret,
    });
    const delta = otpAuth.validate({ token: twoFactorToken, window: 1 });
    return delta !== null;
  }

  private getRandomTwoFactorSecret(): string {
    const otpAuth = new OTPAuth.TOTP(this.otpOptions);
    return otpAuth.secret.base32;
  }

  // toString(): string {
  //   return this.otpAuth.toString();
  // }

  // getSecretBase32(): string {
  //   return this.otpAuth.secret.base32;
  // }
}
