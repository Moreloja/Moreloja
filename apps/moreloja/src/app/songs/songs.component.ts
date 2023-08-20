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
import { GetAllSongsResponseDto } from '@moreloja/api/data-access-dtos';

import { SongCardComponent } from '../song-card/song-card.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'moreloja-songs',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    SongCardComponent,
    PaginationComponent,
    RouterModule,
  ],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SongsComponent implements OnInit {
  songs$!: Observable<GetAllSongsResponseDto>;
  mbidArtist$!: Observable<string>;
  page$!: Observable<number>;

  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private songsService = inject(SongsService);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.mbidArtist$ = this.route.params.pipe(
      map((param) => param['mbidArtist']),
      distinctUntilChanged()
    );
    this.page$ = this.route.params.pipe(map((param) => Number(param['page'])));
    this.songs$ = this.mbidArtist$.pipe(
      //tap((mbidArtist) => console.log('mbidArtist: ' + mbidArtist)),
      switchMap((mbidArtist) =>
        this.page$.pipe(
          tap((page) => {
            this.titleService.setTitle(`Moreloja - Last Songs - Page ${page}`);
          }),
          switchMap((page) => {
            return this.songsService.getAllSongs(mbidArtist, page);
          })
        )
      )
    );
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
