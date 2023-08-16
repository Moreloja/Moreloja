import { Module } from '@nestjs/common';

import {
  AlbumsService,
  PaginationService,
} from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

import { AlbumsController } from './albums.controller';

@Module({
  imports: [DataAccessRepositoriesModule],
  controllers: [AlbumsController],
  providers: [AlbumsService, PaginationService],
})
export class AlbumsModule {}
