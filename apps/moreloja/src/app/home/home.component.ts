import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  computed,
  signal,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';

import { SongsService } from '@moreloja/services/songs';
import { ArtistDto } from '@moreloja/api/data-access-dtos';
import { ArtistsService } from '@moreloja/services/artists';
import { AlbumsService } from '@moreloja/services/albums';
import { Range, Order, Sort } from '@moreloja/shared/global-constants';

import { CoverBannerComponent } from '../cover-banner/cover-banner.component';
import { AlbumCoverCardViewModel } from '../album-cover-card/album-cover-card.component';

@Component({
  selector: 'moreloja-home',
  imports: [AsyncPipe, CoverBannerComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TopSongsComponent implements OnInit {
  albums$!: Observable<AlbumCoverCardViewModel[]>;

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

  private albumsService = inject(AlbumsService);

  ngOnInit(): void {
    this.albums$ = this.albumsService
      .getAlbums(Range.All, Sort.PlayTime, Order.Descending, 1)
      .pipe(
        map((albums) =>
          albums.map((album) => ({
            mbidAlbum: album.Provider_musicbrainzalbum,
            name: album.Album,
          })),
        ),
      );
  }
}
