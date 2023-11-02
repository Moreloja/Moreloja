export class LoginRequest {
  constructor(password: string, twoFactorToken: string) {
    this.password = password;
    this.twoFactorToken = twoFactorToken;
  }

  password: string;
  twoFactorToken: string;
}
