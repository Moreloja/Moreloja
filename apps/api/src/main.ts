/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
// import * as cookieParser from 'cookie-parser';
import cookieParser from 'cookie-parser';

import { AppModule } from './app/app.module';

import {
  AppConfiguration,
  JwtConfiguration,
  ValidationPipeConfiguration,
  appConfiguration,
  defaultAccessTokenSecret,
  defaultDisableErrorMessages,
  defaultRefreshTokenSecret,
  jwtConfiguration,
  validationPipeConfiguration,
} from '@moreloja/api/configurations';
import {
  ApplyAdminConfigService,
  AuthService,
  DatabaseStructureService,
  ImageService,
} from '@moreloja/api/data-access-services';
import {
  PlaceholderAlbumCover,
  PlaceholderArtistCover,
} from '@moreloja/shared/global-constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const imageService = app.get<ImageService>(ImageService);
  await imageService.ensurePlaceholderExists(
    PlaceholderAlbumCover,
    'PlaceholderAlbumCover.webp',
  );
  await imageService.ensurePlaceholderExists(
    PlaceholderArtistCover,
    'PlaceholderArtistCover.webp',
  );

  const databaseStructureService = app.get<DatabaseStructureService>(
    DatabaseStructureService,
  );
  await databaseStructureService.ensureDatabaseStructureIsCorrect();

  const authService = app.get<AuthService>(AuthService);
  await authService.ensureAdminExists();

  const applyAdminConfigService = app.get<ApplyAdminConfigService>(
    ApplyAdminConfigService,
  );
  await applyAdminConfigService.applyAdminConfig();

  // Print warning if JWT secret is the default value
  const jwtConfig = app.get<JwtConfiguration>(jwtConfiguration.KEY);
  if (jwtConfig.accessTokenSecret === defaultAccessTokenSecret) {
    Logger.warn(
      `JWT Access Token Secret is default value (${defaultAccessTokenSecret}). Please change it by using JWT_ACCESS_TOKEN_SECRET environment variable.`,
    );
  }
  if (jwtConfig.refreshTokenSecret === defaultRefreshTokenSecret) {
    Logger.warn(
      `JWT Refresh Token Secret is default value (${defaultRefreshTokenSecret}). Please change it by using JWT_REFRESH_TOKEN_SECRET environment variable.`,
    );
  }

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Print warning if error messages are not disabled
  const validationPipeConfig = app.get<ValidationPipeConfiguration>(
    validationPipeConfiguration.KEY,
  );
  if (
    validationPipeConfig.disableErrorMessages === defaultDisableErrorMessages
  ) {
    Logger.warn(
      `Disable error messages is set to ${defaultDisableErrorMessages}. Please change it to true if you run in production. Use the environment variable DISABLE_ERROR_MESSAGES.`,
    );
  }

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: validationPipeConfig.disableErrorMessages,
      forbidNonWhitelisted: true,
      whitelist: true,
    }),
  );

  app.use(cookieParser());

  const appConfig = app.get<AppConfiguration>(appConfiguration.KEY);
  await app.listen(appConfig.port);
  Logger.log(`Application is running on: ${appConfig.domain}/${globalPrefix}`);
}

bootstrap();
