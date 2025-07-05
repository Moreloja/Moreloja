import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArtistsService } from '@moreloja/services/artists';

import { AlbumCardComponent } from '../album-card/album-card.component';
import { SongCardComponent } from '../song-card/song-card.component';
import { TopSongCardComponent } from '../top-song-card/top-song-card.component';
import { EditableImageComponent } from '../editable-image/editable-image.component';
import { ArtistTopWeeksComponent } from '../artist-top-weeks/artist-top-weeks.component';

@Component({
  selector: 'moreloja-artist',
  imports: [
    AlbumCardComponent,
    ArtistTopWeeksComponent,
    EditableImageComponent,
    SongCardComponent,
    TopSongCardComponent,
    RouterLink,
  ],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistComponent {
  @Input()
  set mbidAlbumArtist(mbidAlbumArtist: string) {
    this.mbidAlbumArtistSignal.set(mbidAlbumArtist);
  }

  mbidAlbumArtistSignal = signal('');
  artist = inject(ArtistsService).getArtist(this.mbidAlbumArtistSignal);
}
