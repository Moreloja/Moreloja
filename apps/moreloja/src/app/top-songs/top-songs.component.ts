import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable, distinctUntilChanged, map } from 'rxjs';
import { SongsService } from '@moreloja/services/songs';
import { Range } from '@moreloja/shared/global-constants';

import { TopSongCardComponent } from '../top-song-card/top-song-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { RangeSelectionComponent } from '../range-selection/range-selection.component';
import { RangeDisplayComponent } from '../range-display/range-display.component';

@Component({
  selector: 'moreloja-top-songs',
  imports: [
    TopSongCardComponent,
    PaginationComponent,
    RangeDisplayComponent,
    RangeSelectionComponent,
    RouterModule,
  ],
  templateUrl: './top-songs.component.html',
  styleUrls: ['./top-songs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TopSongsComponent {
  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private songsService = inject(SongsService);

  range = toSignal(
    this.route.params.pipe(
      map((param) => param['range'] ?? Range.All),
      distinctUntilChanged(),
    ),
    { initialValue: Range.All },
  );
  page = toSignal(
    this.route.params.pipe(map((param) => Number(param['page']))),
    { initialValue: 1 },
  );
  songs = this.songsService.getTopSongs(this.range, this.page);

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
