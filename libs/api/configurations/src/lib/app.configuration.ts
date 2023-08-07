import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const appConfiguration = registerAs('app', () => {
  return {
    protocol: process.env.MORELOJA_APP_PROTOCOL || 'http',
    host: process.env.MORELOJA_APP_HOST || 'localhost',
    port: Number(process.env.MORELOJA_APP_PORT) || '3000',
    get domain() {
      return `${this.protocol}://${this.host}:${this.port}`;
    },
  };
});

export type AppConfiguration = ConfigType<typeof appConfiguration>;

export const InjectAppConfig = () => Inject(appConfiguration.KEY);
