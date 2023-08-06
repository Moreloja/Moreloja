import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { ImageModule } from './image/image.module';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    // TODO Make configurable with environment variables
    MongooseModule.forRoot('mongodb://localhost:27017/webhooks'),
    AlbumsModule,
    ArtistsModule,
    ImageModule,
    SongsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
