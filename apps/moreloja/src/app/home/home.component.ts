import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
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
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, CoverBannerComponent, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TopSongsComponent implements OnInit {
  artists$!: Observable<ArtistDto[]>;
  albums$!: Observable<AlbumCoverCardViewModel[]>;
  songs$!: Observable<AlbumCoverCardViewModel[]>;

  private artistsService = inject(ArtistsService);
  private albumsService = inject(AlbumsService);
  private songsService = inject(SongsService);

  ngOnInit(): void {
    this.artists$ = this.artistsService.getArtists(Range.All, 1);
    this.albums$ = this.albumsService.getAlbums(Range.All, Sort.PlayTime, Order.Descending, 1).pipe(
      map((albums) =>
        albums.map((album) => ({
          mbidAlbum: album.Provider_musicbrainzalbum,
          name: album.Album,
        }))
      )
    );
    this.songs$ = this.songsService.getTopSongs(Range.All, 1).pipe(
      map((songs) =>
        songs.topSongs.map((song) => ({
          mbidAlbum: song.Provider_musicbrainzalbum,
          name: song.Name,
          mbidTrack: song.Provider_musicbrainztrack,
        }))
      )
    );
  }
}
