import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { StatisticsService } from '@moreloja/services/statistics';
import { GetStatisticsDto } from '@moreloja/api/data-access-dtos';

import { SecondsToStringPipe } from '../pipes/seconds-to-string.pipe';

@Component({
  selector: 'moreloja-statistics',
  imports: [AsyncPipe, SecondsToStringPipe],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StatisticsComponent {
  statistics$!: Observable<GetStatisticsDto>;

  statisticsService = inject(StatisticsService);

  ngOnInit(): void {
    this.statistics$ = this.statisticsService.getStatistics();
  }
}
