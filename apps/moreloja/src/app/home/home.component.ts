import {
  ChangeDetectionStrategy,
  Component,
  inject,
  computed,
  signal,
} from '@angular/core';
import { RouterModule } from '@angular/router';

import { SongsService } from '@moreloja/services/songs';
import { ArtistsService } from '@moreloja/services/artists';
import { AlbumsService } from '@moreloja/services/albums';
import { Range, Order, Sort } from '@moreloja/shared/global-constants';

import { CoverBannerComponent } from '../cover-banner/cover-banner.component';

@Component({
  selector: 'moreloja-home',
  imports: [CoverBannerComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TopSongsComponent {
  range = signal(Range.All);
  page = signal(1);
  artists = inject(ArtistsService).getArtists(this.range, this.page);
  topSongs = inject(SongsService).getTopSongs(this.range, this.page);
  songs = computed(() =>
    this.topSongs.value().topSongs.map((song) => ({
      mbidAlbum: song.Provider_musicbrainzalbum,
      name: song.Name,
      mbidTrack: song.Provider_musicbrainztrack,
    })),
  );

  sortBy = signal(Sort.PlayTime);
  order = signal(Order.Descending);
  albumsResponse = inject(AlbumsService).getAlbums(
    this.range,
    this.sortBy,
    this.order,
    this.page,
  );
  albums = computed(() =>
    this.albumsResponse.value().map((album) => ({
      mbidAlbum: album.Provider_musicbrainzalbum,
      name: album.Album,
    })),
  );
}
