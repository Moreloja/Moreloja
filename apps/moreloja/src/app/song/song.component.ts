import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';

import { SongsService } from '@moreloja/services/songs';

import { PaginationComponent } from '../pagination/pagination.component';
import { SongCardComponent } from '../song-card/song-card.component';

@Component({
  selector: 'moreloja-song',
  imports: [PaginationComponent, SongCardComponent],
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

  songs = this.songsService.getAllSongsByTrack(this.mbidTrack, this.page);

  constructor() {
    effect(() => {
      this.titleService.setTitle(`Moreloja - Song - Page ${this.page()}`);
    });
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
