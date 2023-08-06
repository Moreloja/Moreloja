import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { HttpModule } from '@nestjs/axios';

import { Image, ImageSchema } from '@moreloja/api/data-access-models';
import { ImageService } from '@moreloja/api/data-access-services';

import { ImageController } from './image.controller';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
  ],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
