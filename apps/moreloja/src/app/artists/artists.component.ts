import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { distinctUntilChanged, map, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ArtistsService } from '@moreloja/services/artists';
import { ArtistDto } from '@moreloja/api/data-access-dtos';
import { Range } from '@moreloja/shared/global-constants';

import { PaginationComponent } from '../pagination/pagination.component';
import { SecondsToStringPipe } from '../pipes/seconds-to-string.pipe';
import { RangeSelectionComponent } from '../range-selection/range-selection.component';

@Component({
  selector: 'moreloja-artists',
  standalone: true,
  imports: [
    AsyncPipe,
    SecondsToStringPipe,
    NgFor,
    NgIf,
    PaginationComponent,
    RangeSelectionComponent,
    RouterModule,
  ],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistsComponent implements OnInit {
  artists$!: Observable<ArtistDto[]>;
  range$!: Observable<string>;
  page$!: Observable<number>;

  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private artistsService = inject(ArtistsService);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.range$ = this.route.params.pipe(
      map((param) => param['range'] ?? Range.All),
      distinctUntilChanged(),
    );
    this.page$ = this.route.params.pipe(map((param) => Number(param['page'])));
    this.artists$ = this.range$.pipe(
      switchMap((range) =>
        this.page$.pipe(
          tap((page) => {
            this.titleService.setTitle(`Moreloja - Artists - Page ${page}`);
          }),
          switchMap((page) => {
            return this.artistsService.getArtists(range, page);
          }),
        ),
      ),
    );
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }

  getPlayCountBarWidth(playCount: number, maxPlayCount: number): string {
    const percentage = (playCount / maxPlayCount) * 100;
    return percentage + '%';
  }
}
