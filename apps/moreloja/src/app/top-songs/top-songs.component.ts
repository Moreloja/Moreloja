import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable, distinctUntilChanged, map, switchMap, tap } from 'rxjs';

import { SongsService } from '@moreloja/services/songs';
import { GetTopSongsResponseDto } from '@moreloja/api/data-access-dtos';
import { Range } from '@moreloja/shared/global-constants';

import { TopSongCardComponent } from '../top-song-card/top-song-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { RangeSelectionComponent } from '../range-selection/range-selection.component';

@Component({
  selector: 'moreloja-top-songs',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    TopSongCardComponent,
    PaginationComponent,
    RangeSelectionComponent,
    RouterModule,
  ],
  templateUrl: './top-songs.component.html',
  styleUrls: ['./top-songs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TopSongsComponent implements OnInit {
  songs$!: Observable<GetTopSongsResponseDto>;
  range$!: Observable<string>;
  page$!: Observable<number>;

  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private songsService = inject(SongsService);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.range$ = this.route.params.pipe(
      map((param) => param['range'] ?? Range.All),
      distinctUntilChanged()
    );
    this.page$ = this.route.params.pipe(map((param) => Number(param['page'])));
    this.songs$ = this.range$.pipe(
      switchMap((range) =>
        this.page$.pipe(
          tap((page) => {
            this.titleService.setTitle(`Moreloja - Top Songs - Page ${page}`);
          }),
          switchMap((page) => {
            return this.songsService.getTopSongs(range, page);
          })
        )
      )
    );
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
