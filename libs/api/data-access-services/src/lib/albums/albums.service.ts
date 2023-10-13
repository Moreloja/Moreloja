import { Injectable } from '@nestjs/common';

import {
  GetAlbumResponseDto,
  GetAlbumsResponseDto,
  SongDto,
  TopSongDto,
} from '@moreloja/api/data-access-dtos';
import { SongRepository } from '@moreloja/api/data-access-repositories';

import { PaginationService } from '../pagination.service';
import { RangeFilterCreator } from '../rangeFilterCreator';

@Injectable()
export class AlbumsService {
  constructor(
    private songRepository: SongRepository,
    private paginationService: PaginationService,
    private rangeFilterCreator: RangeFilterCreator,
  ) {}

  async getAlbum(mbidAlbum: string): Promise<GetAlbumResponseDto> {
    const albumFilter = {
      Provider_musicbrainzalbum: mbidAlbum,
    };

    const songs = await this.songRepository.findLimitedSongs(
      albumFilter,
      0,
      10
    );

    let albumName = '';
    let artistName = '';
    let artistMbid = '';
    if (songs.length) {
      albumName = songs[0].Album ?? 'Unknown Album';
      artistName = songs[0].Artist ?? 'Unknown Artist';
      artistMbid = songs[0].Provider_musicbrainzalbumartist ?? '';
    }

    const topSongs = await this.songRepository.getTopSongs(albumFilter);

    return new GetAlbumResponseDto(
      albumName,
      artistName,
      artistMbid,
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

  async getAlbums(
    range: string,
    sortBy: string,
    order: string,
    page: number
  ): Promise<GetAlbumsResponseDto> {
    const rangeFilter = this.rangeFilterCreator.constructRangeFilter(range);

    let rangeQuery = {};

    if (rangeFilter) {
      rangeQuery = {
        timestamp: {
          $gte: rangeFilter.searchFrom,
          $lt: rangeFilter.searchTo,
        },
      };
    }

    const albums = await this.songRepository.getDistinctAlbums(
      rangeQuery,
      sortBy,
      order,
      this.paginationService.pagesToSkip(page),
      this.paginationService.itemsPerPage
    );
    return new GetAlbumsResponseDto(albums);
  }
}
