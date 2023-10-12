import { Module } from '@nestjs/common';

import {
  SongsService,
  PaginationService,
  RangeFilterCreator,
} from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

import { SongsController } from './songs.controller';

@Module({
  imports: [DataAccessRepositoriesModule],
  controllers: [SongsController],
  providers: [SongsService, PaginationService, RangeFilterCreator],
})
export class SongsModule {}
