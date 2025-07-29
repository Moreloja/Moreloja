import { Module } from '@nestjs/common';

import {
  ArtistsService,
  PaginationService,
  RangeFilterCreatorWrapper,
} from '@moreloja/api/data-access/services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access/repositories';

import { ArtistsController } from './artists.controller';

@Module({
  imports: [DataAccessRepositoriesModule],
  controllers: [ArtistsController],
  providers: [ArtistsService, PaginationService, RangeFilterCreatorWrapper],
})
export class ArtistsModule {}
