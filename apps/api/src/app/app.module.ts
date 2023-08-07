import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { ImageModule } from './image/image.module';
import { SongsModule } from './songs/songs.module';
import {
  MongoConfiguration,
  appConfiguration,
  mongoConfiguration,
} from './configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration, mongoConfiguration],
    }),
    AlbumsModule,
    ArtistsModule,
    ImageModule,
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
