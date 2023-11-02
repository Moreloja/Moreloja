import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import {
  MongoConfiguration,
  appConfiguration,
  jwtConfiguration,
  mongoConfiguration,
  pictrsConfiguration,
} from '@moreloja/api/configurations';

import { AlbumsModule } from './albums/albums.module';
import { AuthModule } from './auth/auth.module';
import { ArtistsModule } from './artists/artists.module';
import { ImageModule } from './image/image.module';
import { SearchModule } from './search/search.module';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfiguration,
        jwtConfiguration,
        mongoConfiguration,
        pictrsConfiguration,
      ],
    }),
    AlbumsModule,
    ArtistsModule,
    AuthModule,
    ImageModule,
    SearchModule,
    SongsModule,
    MongooseModule.forRootAsync({
      inject: [mongoConfiguration.KEY],
      useFactory: (config: MongoConfiguration) => {
        return {
          uri: config.uri,
          dbName: config.dbName,
        };
      },
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
