import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { AlbumsService } from '@moreloja/services/albums';

import { SongCardComponent } from '../song-card/song-card.component';
import { TopSongCardComponent } from '../top-song-card/top-song-card.component';
import { EditableImageComponent } from '../editable-image/editable-image.component';

@Component({
  selector: 'moreloja-album',
  imports: [
    RouterModule,
    EditableImageComponent,
    SongCardComponent,
    TopSongCardComponent,
  ],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlbumComponent {
  readonly mbidAlbum = input.required<string>();

  private albumsService = inject(AlbumsService);

  album = this.albumsService.getAlbum(this.mbidAlbum);
}
