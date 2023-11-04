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
  appConfiguration,
} from '@moreloja/api/configurations';
import { AuthService, ImageService } from '@moreloja/api/data-access-services';
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

  const authService = app.get<AuthService>(AuthService);
  await authService.ensureAdminExists();

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // TODO Disable error messages in production?
  // {
  //   disableErrorMessages: true,
  // }
  app.useGlobalPipes(
    new ValidationPipe({
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
