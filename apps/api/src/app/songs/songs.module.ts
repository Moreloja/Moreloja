import { Module } from '@nestjs/common';

import { SongsService } from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

import { SongsController } from './songs.controller';

@Module({
  imports: [DataAccessRepositoriesModule],
  controllers: [SongsController],
  providers: [SongsService],
})
export class SongsModule {}
