import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import {
  ApplyAdminConfigService,
  AuthService,
  HashDataService,
} from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

import { AuthController } from './auth.controller';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [CommonModule, DataAccessRepositoriesModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [ApplyAdminConfigService, AuthService, HashDataService],
})
export class AuthModule {}
