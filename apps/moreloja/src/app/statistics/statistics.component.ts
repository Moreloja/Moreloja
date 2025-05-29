import { ChangeDetectionStrategy, Component, inject } from '@angular/core';

import { StatisticsService } from '@moreloja/services/statistics';

import { SecondsToStringPipe } from '../pipes/seconds-to-string.pipe';

@Component({
  selector: 'moreloja-statistics',
  imports: [SecondsToStringPipe],
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class StatisticsComponent {
  statisticsService = inject(StatisticsService);

  statistics = this.statisticsService.getStatistics();

  get averageTracksPerAlbum(): string {
    const totalSongs = this.statistics.value().TotalSongs;
    const totalAlbums = this.statistics.value().TotalAlbums;

    if (totalSongs === undefined || totalAlbums === undefined) {
      return '-';
    }

    return (totalSongs / totalAlbums).toFixed(2);
  }
}
