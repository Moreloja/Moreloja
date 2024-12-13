import { Controller, Get } from '@nestjs/common';

import { StatisticsService } from '@moreloja/api/data-access-services';

@Controller()
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('statistics')
  getStatistics() {
    return this.statisticsService.getStatistics();
  }
}
