import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArtistsService } from '@moreloja/services/artists';

import { AlbumCardComponent } from '../album-card/album-card.component';
import { SongCardComponent } from '../song-card/song-card.component';
import { TopSongCardComponent } from '../top-song-card/top-song-card.component';
import { EditableImageComponent } from '../editable-image/editable-image.component';
import { ArtistTopWeeksComponent } from '../artist-top-weeks/artist-top-weeks.component';
import { SecondsToStringPipe } from '../pipes/seconds-to-string.pipe';

@Component({
  selector: 'moreloja-artist',
  imports: [
    AlbumCardComponent,
    ArtistTopWeeksComponent,
    EditableImageComponent,
    SongCardComponent,
    TopSongCardComponent,
    RouterLink,
    SecondsToStringPipe,
  ],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistComponent {
  readonly mbidAlbumArtist = input.required<string>();
  artist = inject(ArtistsService).getArtist(this.mbidAlbumArtist);
}
