import { Module } from '@nestjs/common';

import {
  ArtistsService,
  PaginationService,
  RangeFilterCreator,
} from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

import { ArtistsController } from './artists.controller';

@Module({
  imports: [DataAccessRepositoriesModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, PaginationService, RangeFilterCreator],
})
export class ArtistsModule {}
