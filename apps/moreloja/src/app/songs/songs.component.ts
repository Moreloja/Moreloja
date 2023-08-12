import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable, map, mergeMap, tap } from 'rxjs';

import { SongsService } from '@moreloja/services/songs';
import { GetAllSongsResponseDto } from '@moreloja/api/data-access-dtos';

import { SongCardComponent } from '../song-card/song-card.component';
import PaginationComponent from '../pagination/pagination.component';

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
  page$!: Observable<number>;

  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private songsService = inject(SongsService);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.page$ = this.route.params.pipe(map((param) => Number(param['page'])));
    this.songs$ = this.page$.pipe(
      tap((page) =>
        this.titleService.setTitle(`Moreloja - Songs - Page ${page}`)
      ),
      mergeMap((page) => this.songsService.getAllSongs(page))
    );
  }

  onPageChange(page: number): void {
    this.router.navigate(['songs/page/', page]);
  }
}
