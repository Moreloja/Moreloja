import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { SongsService } from './songs.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [SongsService],
})
export class AppModule {}
