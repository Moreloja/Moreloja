import { Module } from '@nestjs/common';

import { StatisticsService } from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

import { StatisticsController } from './statistics.controller';

@Module({
  imports: [DataAccessRepositoriesModule],
  controllers: [StatisticsController],
  providers: [StatisticsService],
})
export class StatisticsModule {}
