import { Injectable, Logger } from '@nestjs/common';

import { AuthRepository } from '@moreloja/api/data-access-repositories';
import {
  AdminConfiguration,
  InjectAdminConfig,
} from '@moreloja/api/configurations';

@Injectable()
export class ApplyAdminConfigService {
  constructor(
    private readonly authRepository: AuthRepository,
    @InjectAdminConfig()
    private readonly adminConfiguration: AdminConfiguration,
  ) {}

  async applyAdminConfig(): Promise<void> {
    await this.applyPassword();
    this.applyTwoFactorSecret();
  }

  private async applyPassword(): Promise<void> {
    if (this.adminConfiguration.passwordHash) {
      Logger.log("Applying admin's password...");
      await this.authRepository.updatePassword(
        this.adminConfiguration.passwordHash,
      );
    }
  }

  private async applyTwoFactorSecret(): Promise<void> {
    if (this.adminConfiguration.twoFactorSecret) {
      Logger.log("Applying admin's two factor secret...");
      await this.authRepository.updateTwoFactorSecret(
        this.adminConfiguration.twoFactorSecret,
      );
    }
  }
}
