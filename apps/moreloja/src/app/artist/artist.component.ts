import {
  ChangeDetectionStrategy,
  Component,
  input,
  inject,
  computed,
} from '@angular/core';
import { RouterLink } from '@angular/router';

import { ArtistsService } from '@moreloja/services/artists';

import { AlbumCardComponent } from '../album-card/album-card.component';
import { SongCardComponent } from '../song-card/song-card.component';
import { TopSongCardComponent } from '../top-song-card/top-song-card.component';
import { EditableImageComponent } from '../editable-image/editable-image.component';
import { ArtistTopWeeksComponent } from '../artist-top-weeks/artist-top-weeks.component';
import {
  StatisticsDisplayComponent,
  StatItem,
} from '../statistics-display/statistics-display.component';

@Component({
  selector: 'moreloja-artist',
  imports: [
    AlbumCardComponent,
    ArtistTopWeeksComponent,
    EditableImageComponent,
    SongCardComponent,
    TopSongCardComponent,
    RouterLink,
    StatisticsDisplayComponent,
  ],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistComponent {
  readonly mbidAlbumArtist = input.required<string>();
  artist = inject(ArtistsService).getArtist(this.mbidAlbumArtist);

  readonly stats = computed((): StatItem[] => {
    const artistData = this.artist.value();
    return [
      {
        label: 'Unique songs',
        value: artistData.uniqueSongs,
        valueType: 'number',
      },
      {
        label: 'Total plays',
        value: artistData.playCount,
        valueType: 'number',
      },
      {
        label: 'Total play time',
        value: artistData.playTime,
        pipe: 'secondsToString',
        valueType: 'number',
      },
      {
        label: 'First listen',
        value: artistData.firstSongDate,
        pipe: 'date',
        pipeFormat: 'shortDate',
        valueType: 'string',
      },
      {
        label: 'Last listen',
        value: artistData.lastSongDate,
        pipe: 'date',
        pipeFormat: 'shortDate',
        valueType: 'string',
      },
    ];
  });
}
