import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ImageService } from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

import { ImageController } from './image.controller';


@Module({
  imports: [
    HttpModule,
    DataAccessRepositoriesModule
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
