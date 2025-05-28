import { Injectable } from '@angular/core';
import { HttpResourceRef, httpResource } from '@angular/common/http';

import { GetStatisticsDto } from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  getStatistics(): HttpResourceRef<GetStatisticsDto> {
    return httpResource(
      () => ({
        url: '/api/statistics',
      }),
      {
        defaultValue: new GetStatisticsDto(
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
          undefined,
        ),
      },
    );
  }
}
