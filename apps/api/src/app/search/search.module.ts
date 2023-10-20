import { Module } from '@nestjs/common';

import { SearchService } from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

import { SearchController } from './search.controller';

@Module({
  imports: [DataAccessRepositoriesModule],
  controllers: [SearchController],
  providers: [SearchService],
})
export class SearchModule {}
