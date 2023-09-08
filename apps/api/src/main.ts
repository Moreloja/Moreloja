/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';

import {
  AppConfiguration,
  appConfiguration,
} from '@moreloja/api/configurations';
import { ImageService } from '@moreloja/api/data-access-services';
import { PlaceholderAlbumCover, PlaceholderArtistCover } from '@moreloja/shared/global-constants';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const imageService = app.get<ImageService>(ImageService);
  await imageService.ensurePlaceholderExists(PlaceholderAlbumCover, 'PlaceholderAlbumCover.webp');
  await imageService.ensurePlaceholderExists(PlaceholderArtistCover, 'PlaceholderArtistCover.webp');

  const appConfig = app.get<AppConfiguration>(appConfiguration.KEY);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  await app.listen(appConfig.port);
  Logger.log(
    `Application is running on: ${appConfig.domain}/${globalPrefix}`
  );
}

bootstrap();
