import { Injectable } from '@nestjs/common';

import {
  GetAlbumResponseDto,
  GetAlbumsResponseDto,
  SongDto,
  TopSongDto,
} from '@moreloja/api/data-access-dtos';
import { SongRepository } from '@moreloja/api/data-access-repositories';
import { Range } from '@moreloja/shared/global-constants';

import { PaginationService } from '../pagination.service';

@Injectable()
export class AlbumsService {
  constructor(
    private songRepository: SongRepository,
    private paginationService: PaginationService
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
    if (songs.length) {
      albumName = songs[0].Album ?? 'Unknown Album';
    }

    const topSongs = await this.songRepository.getTopSongs(albumFilter);

    return new GetAlbumResponseDto(
      albumName,
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
    // TODO Move this to its own service if its used by other services
    const rangeFilter = this.constructRangeQuery(range);

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

  private constructRangeQuery(range: string):
    | {
        searchFrom: Date;
        searchTo: Date;
      }
    | undefined {
    if (range === Range.All) {
      return undefined;
    }

    // Check if range contains string "W"
    if (range.includes('W')) {
      const year = range.replace('-', '').split('W')[0];
      const week = range.replace('-', '').split('W')[1];

      const weekStartDate = this.getFirstDateOfWeek(
        parseInt(year),
        parseInt(week)
      );
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 7);
      weekEndDate.setHours(23, 59, 59);

      return {
        searchFrom: weekStartDate,
        searchTo: weekEndDate,
      };
    } else {
      const parts = range.split('-');
      const partsCount = parts.length;

      if (partsCount === 1) {
        const year = parts[0];
        return {
          searchFrom: new Date(parseInt(year), 0, 1),
          searchTo: new Date(parseInt(year), 11, 31, 23, 59, 59),
        };
      } else if (partsCount === 2) {
        const year = parts[0];
        const month = parts[1];
        return {
          searchFrom: new Date(parseInt(year), parseInt(month) - 1, 1),
          searchTo: new Date(
            parseInt(year),
            parseInt(month) - 1,
            31,
            23,
            59,
            59
          ),
        };
      } else if (partsCount === 3) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        return {
          searchFrom: new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day)
          ),
          searchTo: new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            23,
            59,
            59
          ),
        };
      }
    }

    throw 'Invalid range';
  }

  private getFirstDateOfWeek(year: number, week: number): Date {
    // Assuming the week starts on Monday (ISO week date standard)
    const januaryFourth = new Date(year, 0, 4);
    const daysToAdd = (week - 1) * 7;
    const firstWeekDay = januaryFourth.getDay(); // 0-based index, 0 for Sunday, 1 for Monday, etc.

    // Calculate the starting date of the given week
    const startDate = new Date(year, 0, 4 + (1 - firstWeekDay) + daysToAdd);

    return startDate;
  }
}
