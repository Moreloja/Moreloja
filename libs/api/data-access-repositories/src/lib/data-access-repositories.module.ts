import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Image, ImageSchema, Song, SongSchema } from '@moreloja/api/data-access-models';

import { ImageRepository } from './image.repository';
import { SongRepository } from './song.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
  ],
  providers: [ImageRepository, SongRepository],
  exports: [ImageRepository, SongRepository],
})
export class DataAccessRepositoriesModule {}
