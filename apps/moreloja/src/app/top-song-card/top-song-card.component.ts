import { Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { TopSongDto } from '@moreloja/api/data-access-dtos';
import { AlbumsService } from '@moreloja/services/albums';

@Component({
  selector: 'moreloja-top-song-card',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, RouterModule],
  templateUrl: './top-song-card.component.html',
  styleUrls: ['./top-song-card.component.css'],
})
export class TopSongCardComponent implements OnInit {
  
  @Input()
  topSong!: TopSongDto;

  @Input()
  maxPlayCount!: number;

  coverUrl$!: Observable<string>;

  private albumsService = inject(AlbumsService);

  ngOnInit(): void {
    this.coverUrl$ = this.albumsService.getAlbumCover(
      this.topSong.Provider_musicbrainzalbum
    );
  }

  getPlayCountBarWidth(playCount: number): string {
    const percentage = (playCount / this.maxPlayCount) * 100;
    return percentage + '%';
  }
}
