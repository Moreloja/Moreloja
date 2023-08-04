import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppController } from './app.controller';
import { SongsModule } from './songs/songs.module';

@Module({
  imports: [
    // TODO Make configurable with environment variables
    MongooseModule.forRoot('mongodb://localhost:27017/webhooks'),
    SongsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
