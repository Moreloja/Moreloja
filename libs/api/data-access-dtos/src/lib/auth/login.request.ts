import { Length, MinLength } from 'class-validator';

export class LoginRequest {
  constructor(password: string, twoFactorToken: string) {
    this.password = password;
    this.twoFactorToken = twoFactorToken;
  }

  @MinLength(10)
  password: string;

  @Length(6, 6)
  twoFactorToken: string;
}
