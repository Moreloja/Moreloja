import { Injectable } from '@nestjs/common';

import {
  GetAllSongsResponseDto,
  GetTopSongsResponseDto,
  GetSongDetailsResponseDto,
  SongDto,
  TopSongDto,
} from '@moreloja/api/data-access/dtos';
import { SongRepository } from '@moreloja/api/data-access/repositories';
import { Song } from '@moreloja/api/data-access/models';

import { PaginationService } from '../pagination.service';
import { RangeFilterCreatorWrapper } from '../range-filter-creator.wrapper';

@Injectable()
export class SongsService {
  constructor(
    private songRepository: SongRepository,
    private paginationService: PaginationService,
    private rangeFilterCreator: RangeFilterCreatorWrapper,
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

  async getSongDetails(
    mbidTrack: string,
    page: number,
  ): Promise<GetSongDetailsResponseDto> {
    const filter = { Provider_musicbrainztrack: mbidTrack };

    // Get song details (playcount and dates)
    const songDetails = await this.songRepository.getSongDetails(mbidTrack);

    // Get paginated songs
    const songs = await this.songRepository.findLimitedSongs(
      filter,
      this.paginationService.pagesToSkip(page),
      this.paginationService.itemsPerPage,
    );

    // Get song name from the first song (they should all have the same name for the same track)
    const songName =
      songs.length > 0 ? songs[0].Name || 'Unknown Song' : 'Unknown Song';

    return new GetSongDetailsResponseDto(
      songName,
      songDetails.playCount,
      songDetails.firstListenDate,
      songDetails.lastListenDate,
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

  async getTotalPagesByArtist(mbidArtist: string): Promise<number> {
    let filter = {};
    if (mbidArtist !== 'undefined') {
      filter = { Provider_musicbrainzartist: mbidArtist };
    }
    const totalSongs = await this.songRepository.countSongs(filter);
    return Math.max(
      1,
      Math.ceil(totalSongs / this.paginationService.itemsPerPage),
    );
  }

  async getTotalPagesByTrack(mbidTrack: string): Promise<number> {
    const filter = { Provider_musicbrainztrack: mbidTrack };
    const totalSongs = await this.songRepository.countSongs(filter);
    return Math.max(
      1,
      Math.ceil(totalSongs / this.paginationService.itemsPerPage),
    );
  }

  async getTotalPagesForTopSongs(range: string): Promise<number> {
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
    const totalSongs = await this.songRepository.countUniqueSongs(rangeQuery);
    return Math.max(
      1,
      Math.ceil(totalSongs / this.paginationService.itemsPerPage),
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
