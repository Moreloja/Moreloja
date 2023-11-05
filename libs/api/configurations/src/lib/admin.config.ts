import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const adminConfiguration = registerAs('admin', () => {
  return {
    passwordHash: process.env['MORELOJA_ADMIN_PASSWORD_HASH'] || undefined,
    twoFactorSecret:
      process.env['MORELOJA_ADMIN_TWO_FACTOR_SECRET'] || undefined,
  };
});

export type AdminConfiguration = ConfigType<typeof adminConfiguration>;

export const InjectAdminConfig = () => Inject(adminConfiguration.KEY);
