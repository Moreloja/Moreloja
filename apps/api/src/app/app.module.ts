import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';

import {
  MongoConfiguration,
  appConfiguration,
  mongoConfiguration,
  pictrsConfiguration,
} from '@moreloja/api/configurations';

import { AlbumsModule } from './albums/albums.module';
import { ArtistsModule } from './artists/artists.module';
import { ImageModule } from './image/image.module';
import { SongsModule } from './songs/songs.module';

import { ProxyMiddleware } from './middleware/proxy.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfiguration, mongoConfiguration, pictrsConfiguration],
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
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(ProxyMiddleware)
      .forRoutes({ path: 'image/original/*', method: RequestMethod.GET });
  }
}
