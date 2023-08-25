import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TopSongDto } from '@moreloja/api/data-access-dtos';

import {
  AlbumCoverCardComponent,
  AlbumCoverCardViewModel,
} from '../album-cover-card/album-cover-card.component';

@Component({
  selector: 'moreloja-top-song-card',
  standalone: true,
  imports: [NgFor, NgIf, AlbumCoverCardComponent, RouterModule],
  templateUrl: './top-song-card.component.html',
  styleUrls: ['./top-song-card.component.css'],
})
export class TopSongCardComponent {
  @Input()
  topSong!: TopSongDto;

  @Input()
  maxPlayCount!: number;

  getPlayCountBarWidth(playCount: number): string {
    const percentage = (playCount / this.maxPlayCount) * 100;
    return percentage + '%';
  }

  getAlbumCoverCardViewModel(): AlbumCoverCardViewModel {
    return {
      mbidAlbum: this.topSong.Provider_musicbrainzalbum,
      name: this.topSong.Name,
      mbidTrack: this.topSong.Provider_musicbrainztrack,
    };
  }
}
