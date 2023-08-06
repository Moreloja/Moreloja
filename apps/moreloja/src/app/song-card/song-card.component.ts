import { Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { SongDto } from '@moreloja/api/data-access-dtos';
import { AlbumsService } from '@moreloja/services/albums';

import { StringToDatePipe, TimeAgoPipe } from '../pipes';

@Component({
  selector: 'moreloja-song-card',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgIf,
    RouterModule,
    StringToDatePipe,
    TimeAgoPipe,
  ],
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.css'],
})
export class SongCardComponent implements OnInit {
  @Input()
  song!: SongDto;

  coverUrl$!: Observable<string>;

  private albumsService = inject(AlbumsService);

  ngOnInit(): void {
    this.coverUrl$ = this.albumsService.getAlbumCover(
      this.song.Provider_musicbrainzalbum
    );
  }
}
