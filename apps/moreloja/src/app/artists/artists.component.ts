import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { AsyncPipe } from '@angular/common';
import { distinctUntilChanged, map, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ArtistsService } from '@moreloja/services/artists';
import { ArtistDto } from '@moreloja/api/data-access-dtos';
import { Range } from '@moreloja/shared/global-constants';

import { PaginationComponent } from '../pagination/pagination.component';
import { SecondsToStringPipe } from '../pipes/seconds-to-string.pipe';
import { RangeSelectionComponent } from '../range-selection/range-selection.component';
import { RangeDisplayComponent } from '../range-display/range-display.component';

@Component({
  selector: 'moreloja-artists',
  imports: [
    AsyncPipe,
    SecondsToStringPipe,
    PaginationComponent,
    RangeDisplayComponent,
    RangeSelectionComponent,
    RouterModule,
  ],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistsComponent {
  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private artistsService = inject(ArtistsService);
  private titleService = inject(Title);

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
  artists = this.artistsService.getArtists(this.range, this.page);

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }

  getPlayCountBarWidth(playCount: number, maxPlayCount: number): string {
    const percentage = (playCount / maxPlayCount) * 100;
    return percentage + '%';
  }

  updateTitleEffect = effect(() => {
    this.titleService.setTitle(`Moreloja - Artists - Page ${this.page()}`);
  });
}
