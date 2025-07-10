import { Component, input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AlbumDto } from '@moreloja/api/data-access-dtos';

import {
  AlbumCoverCardComponent,
  AlbumCoverCardViewModel,
} from '../album-cover-card/album-cover-card.component';

@Component({
  selector: 'moreloja-album-card',
  imports: [SlicePipe, AlbumCoverCardComponent, RouterModule],
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.css'],
})
export class AlbumCardComponent {
  readonly album = input.required<AlbumDto>();

  getAlbumCoverCardViewModel(): AlbumCoverCardViewModel {
    return {
      mbidAlbum: this.album().Provider_musicbrainzalbum,
      name: this.album().Album,
    };
  }
}
