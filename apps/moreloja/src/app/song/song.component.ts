import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  computed,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';

import { SongsService } from '@moreloja/services/songs';

import { PaginationComponent } from '../pagination/pagination.component';
import { SongCardComponent } from '../song-card/song-card.component';
import {
  StatisticsDisplayComponent,
  StatItem,
} from '../statistics-display/statistics-display.component';

@Component({
  selector: 'moreloja-song',
  imports: [PaginationComponent, SongCardComponent, StatisticsDisplayComponent],
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SongComponent {
  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private songsService = inject(SongsService);
  private titleService = inject(Title);

  mbidTrack = toSignal(
    this.route.params.pipe(map((param) => param['mbidTrack'])),
    { initialValue: '' },
  );
  page = toSignal(
    this.route.params.pipe(map((param) => Number(param['page']))),
    { initialValue: 1 },
  );
  totalPages = this.songsService.getTotalPagesByTrack(this.mbidTrack);

  songDetails = this.songsService.getSongDetails(this.mbidTrack, this.page);

  readonly stats = computed((): StatItem[] => {
    const songData = this.songDetails.value();
    return [
      {
        label: 'Total plays',
        value: songData.playCount,
        valueType: 'number',
      },
      {
        label: 'First listen',
        value: songData.firstListenDate,
        pipe: 'date',
        pipeFormat: 'shortDate',
        valueType: 'string',
      },
      {
        label: 'Last listen',
        value: songData.lastListenDate,
        pipe: 'date',
        pipeFormat: 'shortDate',
        valueType: 'string',
      },
    ];
  });

  constructor() {
    effect(() => {
      this.titleService.setTitle(`Moreloja - Song - Page ${this.page()}`);
    });
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
