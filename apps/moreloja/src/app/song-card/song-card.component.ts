import { Component, Input } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SongDto } from '@moreloja/api/data-access-dtos';

import { StringToDatePipe, TimeAgoPipe } from '../pipes';
import {
  AlbumCoverCardComponent,
  AlbumCoverCardViewModel,
} from '../album-cover-card/album-cover-card.component';
import { JsonModalBoxComponent } from '../modal-box/json-modal-box';

@Component({
  selector: 'moreloja-song-card',
  standalone: true,
  imports: [
    DatePipe,
    NgIf,
    RouterModule,
    StringToDatePipe,
    AlbumCoverCardComponent,
    JsonModalBoxComponent,
    TimeAgoPipe,
  ],
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.css'],
})
export class SongCardComponent {
  @Input()
  song!: SongDto;

  getAlbumCoverCardViewModel(): AlbumCoverCardViewModel {
    return {
      mbidAlbum: this.song.Provider_musicbrainzalbum,
      name: this.song.Name,
      mbidTrack: this.song.Provider_musicbrainztrack,
    };
  }
}
