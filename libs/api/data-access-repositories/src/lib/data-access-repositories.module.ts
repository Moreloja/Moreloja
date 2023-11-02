import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import {
  Auth,
  AuthSchema,
  Image,
  ImageSchema,
  Song,
  SongSchema,
} from '@moreloja/api/data-access-models';

import { ImageRepository } from './image.repository';
import { SongRepository } from './song.repository';
import { AuthRepository } from './auth.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Auth.name, schema: AuthSchema }]),
    MongooseModule.forFeature([{ name: Image.name, schema: ImageSchema }]),
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
  ],
  providers: [AuthRepository, ImageRepository, SongRepository],
  exports: [AuthRepository, ImageRepository, SongRepository],
})
export class DataAccessRepositoriesModule {}
