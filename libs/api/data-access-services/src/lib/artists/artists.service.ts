import { Injectable } from '@nestjs/common';

import {
  AlbumDto,
  ArtistDto,
  GetArtistResponse,
  GetArtistsResponse,
  SongDto,
  TopSongDto,
} from '@moreloja/api/data-access-dtos';
import { SongRepository } from '@moreloja/api/data-access-repositories';
import { Order, Sort } from '@moreloja/shared/global-constants';

import { PaginationService } from '../pagination.service';

@Injectable()
export class ArtistsService {
  constructor(
    private paginationService: PaginationService,
    private songRepository: SongRepository
  ) {}

  async getArtist(mbidAlbumArtist: string): Promise<GetArtistResponse> {
    const artistFilter = {
      Provider_musicbrainzartist: mbidAlbumArtist,
    };

    const albumArtistFilter = {
      Provider_musicbrainzalbumartist: mbidAlbumArtist,
    };

    const songs = await this.songRepository.findLimitedSongs(
      artistFilter,
      0,
      10
    );

    const artistName = await this.songRepository.findArtistName(
      mbidAlbumArtist
    );

    const topSongs = await this.songRepository.getTopSongs(artistFilter, 0, 10);

    const distinctAlbums = await this.songRepository.getDistinctAlbums(
      albumArtistFilter,
      Sort.Year,
      Order.Descending
    );

    const appearsOnDistinctAlbums = await this.songRepository.getDistinctAlbums(
      {
        Provider_musicbrainzartist: mbidAlbumArtist,
        Provider_musicbrainzalbumartist: { $ne: mbidAlbumArtist },
      },
      Sort.Year,
      Order.Descending
    );

    return new GetArtistResponse(
      artistName,
      distinctAlbums.map(
        (album) =>
          new AlbumDto(
            album.Album ?? '',
            album.Provider_musicbrainzalbum ?? '',
            album.Year ?? ''
          )
      ),
      appearsOnDistinctAlbums.map(
        (album) =>
          new AlbumDto(
            album.Album ?? '',
            album.Provider_musicbrainzalbum ?? '',
            album.Year ?? ''
          )
      ),
      topSongs.map(
        (song) =>
          new TopSongDto(
            song.Album ?? '',
            song.Name ?? '',
            song.Provider_musicbrainzalbum ?? '',
            song.Provider_musicbrainztrack ?? '',
            song.run_time ?? 0,
            song.playCount ?? 0
          )
      ),
      songs.map(
        (song) =>
          new SongDto(
            song.Album ?? '',
            song.Artist ?? '',
            song.Name ?? '',
            song.timestamp ?? '',
            song.Provider_musicbrainzalbum ?? '',
            song.Provider_musicbrainzalbumartist ?? '',
            song.Provider_musicbrainzartist ?? '',
            song.Provider_musicbrainztrack ?? '',
            song.run_time ?? 0
          )
      )
    );
  }

  async getArtists(page: number): Promise<GetArtistsResponse> {
    const artists = await this.songRepository.getArtists(
      this.paginationService.pagesToSkip(page),
      this.paginationService.itemsPerPage
    );
    return new GetArtistsResponse(
      artists.map(
        (artist) =>
          new ArtistDto(
            artist.Provider_musicbrainzartist,
            artist.Artist,
            artist.playCount,
            artist.playTime
          )
      )
    );
  }
}
