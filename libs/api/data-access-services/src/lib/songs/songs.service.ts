import { Injectable } from '@nestjs/common';

import {
  GetAllSongsResponseDto,
  GetTopSongsResponseDto,
  SongDto,
  TopSongDto,
} from '@moreloja/api/data-access-dtos';
import { SongRepository } from '@moreloja/api/data-access-repositories';
import { Song } from '@moreloja/api/data-access-models';

import { PaginationService } from '../pagination.service';
import { RangeFilterCreator } from '../rangeFilterCreator';

@Injectable()
export class SongsService {
  constructor(
    private songRepository: SongRepository,
    private paginationService: PaginationService,
    private rangeFilterCreator: RangeFilterCreator,
  ) {}

  async getAllSongs(
    mbidArtist: string,
    page: number,
  ): Promise<GetAllSongsResponseDto> {
    let filter = {};

    if (mbidArtist !== 'undefined') {
      filter = { Provider_musicbrainzartist: mbidArtist };
    }

    const songs = await this.songRepository.findLimitedSongs(
      filter,
      this.paginationService.pagesToSkip(page),
      this.paginationService.itemsPerPage,
    );
    return this.createGetAllSongsResponseDto(songs);
  }

  async getAllSongsByTrack(
    mbidTrack: string,
    page: number,
  ): Promise<GetAllSongsResponseDto> {
    const songs = await this.songRepository.findLimitedSongs(
      { Provider_musicbrainztrack: mbidTrack },
      this.paginationService.pagesToSkip(page),
      this.paginationService.itemsPerPage,
    );
    return this.createGetAllSongsResponseDto(songs);
  }

  async getTopSongs(
    range: string,
    page: number,
  ): Promise<GetTopSongsResponseDto> {
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
    const topSongs = await this.songRepository.getTopSongs(
      rangeQuery,
      this.paginationService.pagesToSkip(page),
      this.paginationService.itemsPerPage,
    );
    return new GetTopSongsResponseDto(
      topSongs.map(
        (song) =>
          new TopSongDto(
            song.Album ?? '',
            song.Name ?? '',
            song.Provider_musicbrainzalbum ?? '',
            song.Provider_musicbrainztrack ?? '',
            song.run_time ?? 0,
            song.playCount ?? 0,
          ),
      ),
    );
  }

  private createGetAllSongsResponseDto(songs: Song[]): GetAllSongsResponseDto {
    return new GetAllSongsResponseDto(
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
            song.run_time ?? 0,
          ),
      ),
    );
  }
}
