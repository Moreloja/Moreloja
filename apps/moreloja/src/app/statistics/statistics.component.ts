import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import { StatisticsService } from '@moreloja/services/statistics';

import { SecondsToStringPipe } from '../pipes/seconds-to-string.pipe';

@Component({
  selector: 'moreloja-statistics',
  imports: [AsyncPipe, SecondsToStringPipe],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StatisticsComponent {
  statisticsService = inject(StatisticsService);

  statistics = this.statisticsService.getStatistics();
}
