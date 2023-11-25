import { Module } from '@nestjs/common';

import { DatabaseStructureService } from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

@Module({
  imports: [DataAccessRepositoriesModule],
  controllers: [],
  providers: [DatabaseStructureService],
})
export class DatabaseStructureModule {}
