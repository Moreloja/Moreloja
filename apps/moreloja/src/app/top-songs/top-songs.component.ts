import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable, map, switchMap, tap } from 'rxjs';

import { SongsService } from '@moreloja/services/songs';
import { GetTopSongsResponseDto } from '@moreloja/api/data-access-dtos';

import { TopSongCardComponent } from '../top-song-card/top-song-card.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { CoverBannerComponent } from '../cover-banner/cover-banner.component';

@Component({
  selector: 'moreloja-top-songs',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    TopSongCardComponent,
    PaginationComponent,
    CoverBannerComponent,
    RouterModule,
  ],
  templateUrl: './top-songs.component.html',
  styleUrls: ['./top-songs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TopSongsComponent implements OnInit {
  songs$!: Observable<GetTopSongsResponseDto>;
  page$!: Observable<number>;

  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private songsService = inject(SongsService);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.page$ = this.route.params.pipe(map((param) => Number(param['page'])));
    this.songs$ = this.page$.pipe(
      tap((page) => {
        this.titleService.setTitle(`Moreloja - Top Songs - Page ${page}`);
      }),
      switchMap((page) => {
        return this.songsService.getTopSongs(page);
      })
    );
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
