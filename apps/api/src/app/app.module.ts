import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ArtistsModule } from './artists/artists.module';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    // TODO Make configurable with environment variables
    MongooseModule.forRoot('mongodb://localhost:27017/webhooks'),
    ArtistsModule,
    SongsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
