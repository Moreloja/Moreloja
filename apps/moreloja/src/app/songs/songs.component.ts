import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map } from 'rxjs';

import { SongsService } from '@moreloja/services/songs';

import { SongCardComponent } from '../song-card/song-card.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'moreloja-songs',
  imports: [SongCardComponent, PaginationComponent, RouterModule],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SongsComponent {
  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private songsService = inject(SongsService);
  private titleService = inject(Title);

  mbidArtist = toSignal(
    this.route.params.pipe(map((param) => param['mbidArtist'])),
    { initialValue: '' },
  );
  page = toSignal(
    this.route.params.pipe(map((param) => Number(param['page']))),
    { initialValue: 1 },
  );
  totalPages = this.songsService.getTotalPagesByArtist(this.mbidArtist);

  songs = this.songsService.getAllSongs(this.mbidArtist, this.page);

  constructor() {
    effect(() => {
      this.titleService.setTitle(`Moreloja - Last Songs - Page ${this.page()}`);
    });
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
