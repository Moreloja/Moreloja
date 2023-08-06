import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Song, SongSchema } from '@moreloja/api/data-access-models';

import { SongRepository } from './song.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Song.name, schema: SongSchema }]),
  ],
  providers: [SongRepository],
  exports: [SongRepository],
})
export class DataAccessRepositoriesModule {}
