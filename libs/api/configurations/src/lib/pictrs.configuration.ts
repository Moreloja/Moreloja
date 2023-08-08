import { Inject } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export const pictrsConfiguration = registerAs('pictrs', () => {
  return {
    protocol: process.env['PICTRS_PROTOCOL'] || 'http',
    host: process.env['PICTRS_HOST'] || 'localhost',
    port: Number(process.env['PICTRS_PORT']) || '8080',
    get domain() {
      return `${this.protocol}://${this.host}:${this.port}`;
    },
  };
});

export type PictrsConfiguration = ConfigType<typeof pictrsConfiguration>;

export const InjectPictrsConfig = () => Inject(pictrsConfiguration.KEY);
