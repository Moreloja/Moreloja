import { Module } from '@nestjs/common';

import { AccessTokenStrategy, RefreshTokenStrategy } from './strategies';

@Module({
  controllers: [],
  providers: [AccessTokenStrategy, RefreshTokenStrategy],
  exports: [],
})
export class CommonModule {}
