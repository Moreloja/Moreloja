import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable, distinctUntilChanged, map, switchMap, tap } from 'rxjs';

import { GetAllSongsResponseDto } from '@moreloja/api/data-access-dtos';
import { SongsService } from '@moreloja/services/songs';

import { PaginationComponent } from '../pagination/pagination.component';
import { SongCardComponent } from '../song-card/song-card.component';

@Component({
  selector: 'moreloja-song',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, PaginationComponent, SongCardComponent],
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SongComponent implements OnInit {
  songs$!: Observable<GetAllSongsResponseDto>;
  mbidTrack$!: Observable<string>;
  page$!: Observable<number>;

  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private songsService = inject(SongsService);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.mbidTrack$ = this.route.params.pipe(
      map((param) => param['mbidTrack']),
      distinctUntilChanged()
    );
    this.page$ = this.route.params.pipe(map((param) => Number(param['page'])));
    this.songs$ = this.mbidTrack$.pipe(
      //tap((mbidTrack) => console.log('mbidTrack: ' + mbidTrack)),
      switchMap((mbidTrack) =>
        this.page$.pipe(
          tap((page) => {
            this.titleService.setTitle(`Moreloja - Song - Page ${page}`);
          }),
          switchMap((page) => {
            return this.songsService.getAllSongsByTrack(mbidTrack, page);
          })
        )
      )
    );
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
