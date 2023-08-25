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

import { CoverBannerComponent } from '../cover-banner/cover-banner.component';
import { AlbumCoverCardViewModel } from '../album-cover-card/album-cover-card.component';
import { AlbumsService } from '@moreloja/services/albums';

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
    this.artists$ = this.artistsService.getArtists(1);
    this.albums$ = this.albumsService.getAlbums(1).pipe(
      map((albums) =>
        albums.map((album) => ({
          mbidAlbum: album.Provider_musicbrainzalbum,
          name: album.Album,
        }))
      )
    );
    this.songs$ = this.songsService.getTopSongs(1).pipe(
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