import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Song } from '@moreloja/api/data-access-models';
import { Order, Sort } from '@moreloja/shared/global-constants';
import {
  SearchResultDto,
  WeeklyTopArtistsDto,
} from '@moreloja/api/data-access-dtos';

@Injectable()
export class SongRepository {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  async findLimitedSongs(albumArtistFilter: any, skip: number, limit: number) {
    return await this.songModel
      .find(albumArtistFilter)
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async findArtistName(mbidAlbumArtist: string): Promise<string> {
    const unknownArtist = 'Unknown Artist';
    const song = await this.songModel
      .findOne({ Provider_musicbrainzartist: mbidAlbumArtist })
      .exec();
    if (song) {
      return song.Artist ?? unknownArtist;
    }

    return unknownArtist;
  }

  async getDistinctAlbums(
    albumArtistFilter: any,
    sortBy?: string,
    order?: string,
    skip?: number,
    limit?: number,
  ): Promise<
    {
      Provider_musicbrainzalbum: string;
      Album: string;
      Year: number;
      playTime: number;
    }[]
  > {
    let sort = Sort.Year;
    if (sortBy === Sort.PlayTime) {
      sort = sortBy;
    }

    let sortOrder: 1 | -1 = 1;
    if (order === Order.Descending) {
      sortOrder = -1;
    }

    return await this.songModel.aggregate([
      { $match: albumArtistFilter },
      {
        $group: {
          _id: '$Provider_musicbrainzalbum',
          Album: { $first: '$Album' },
          Year: { $first: '$Year' },
          playTime: { $sum: '$run_time' },
        },
      },
      { $sort: { [sort]: sortOrder, _id: 1 } },
      // Apply skip if provided
      ...(skip ? [{ $skip: skip }] : []),
      // Apply the limit if provided
      ...(limit ? [{ $limit: limit }] : []),
      {
        $project: {
          _id: 0,
          Provider_musicbrainzalbum: '$_id',
          Album: 1,
          Year: 1,
          playTime: 1,
        },
      },
    ]);
  }

  async getTopSongs(
    songFilter: any,
    skip?: number,
    limit?: number,
  ): Promise<any[]> {
    const topSongs = await this.songModel.aggregate([
      { $match: songFilter },
      // Group by musicbrainztrack to get play count for each song
      {
        $group: {
          _id: '$Provider_musicbrainztrack',
          Album: { $first: '$Album' },
          Name: { $first: '$Name' },
          Provider_musicbrainzalbum: { $first: '$Provider_musicbrainzalbum' },
          run_time: { $first: '$run_time' },
          playCount: { $sum: 1 },
        },
      },
      // Sort by play count in descending order
      { $sort: { playCount: -1, _id: 1 } },
      // Apply skip if provided
      ...(skip ? [{ $skip: skip }] : []),
      // Apply the limit if provided
      ...(limit ? [{ $limit: limit }] : []),
      {
        $project: {
          _id: 0,
          Album: 1,
          Name: 1,
          Provider_musicbrainzalbum: 1,
          Provider_musicbrainztrack: '$_id',
          run_time: 1,
          playCount: 1,
        },
      },
    ]);
    return topSongs;
  }

  async getArtists(
    filter: any,
    skip?: number,
    limit?: number,
  ): Promise<
    {
      Provider_musicbrainzartist: string;
      Artist: string;
      playCount: number;
      playTime: number;
    }[]
  > {
    const artists = await this.songModel.aggregate([
      { $match: filter },
      // Group by musicbrainzartist to get play count for each artist
      {
        $group: {
          _id: '$Provider_musicbrainzartist',
          Artist: { $first: '$Artist' },
          playCount: { $sum: 1 },
          playTime: { $sum: '$run_time' },
        },
      },
      // Sort by play count in descending order
      { $sort: { playTime: -1, _id: 1 } },
      // Apply skip if provided
      ...(skip ? [{ $skip: skip }] : []),
      // Apply the limit if provided
      ...(limit ? [{ $limit: limit }] : []),
      {
        $project: {
          _id: 0,
          Provider_musicbrainzartist: '$_id',
          Artist: 1,
          playCount: 1,
          playTime: 1,
        },
      },
    ]);
    return artists;
  }

  async getArtistAndAlbumByMusicbrainzalbumId(
    musicbrainzalbum: string,
  ): Promise<{ artist: string; album: string } | undefined> {
    const song = await this.songModel
      .findOne({ Provider_musicbrainzalbum: musicbrainzalbum })
      .exec();
    if (song) {
      return { artist: song.Artist ?? '', album: song.Album ?? '' };
    }

    return undefined;
  }

  async getArtistByMusicbrainzartistId(
    mbidArtist: string,
  ): Promise<{ artist: string } | undefined> {
    const song = await this.songModel
      .findOne({ Provider_musicbrainzartist: mbidArtist })
      .exec();
    if (song) {
      return { artist: song.Artist ?? '' };
    }

    return undefined;
  }

  async getWeeklyTopArtists(): Promise<WeeklyTopArtistsDto[]> {
    const result: WeeklyTopArtistsDto[] = await this.songModel
      .aggregate([
        {
          $group: {
            _id: {
              Year: { $year: '$timestamp' },
              Week: { $isoWeek: '$timestamp' },
              Provider_musicbrainzartist: '$Provider_musicbrainzartist',
            },
            Plays: { $sum: '$run_time' },
            Artist: { $first: '$Artist' },
          },
        },
        {
          $group: {
            _id: {
              Year: '$_id.Year',
              Week: '$_id.Week',
            },
            Artists: {
              $push: {
                Provider_musicbrainzartist: '$_id.Provider_musicbrainzartist',
                Artist: '$Artist',
                Plays: '$Plays',
              },
            },
          },
        },
        {
          $sort: { '_id.Year': -1, '_id.Week': -1 },
        },
        {
          $project: {
            _id: 0,
            Year: '$_id.Year',
            Week: '$_id.Week',
            Artists: 1,
          },
        },
      ])
      .exec();
    const sortedResult = result.map((dto) => {
      return { ...dto, Artists: dto.Artists.sort((a, b) => b.Plays - a.Plays) };
    });
    return sortedResult;
  }

  async searchAll(search: string): Promise<SearchResultDto> {
    const albums = await this.songModel
      .aggregate([
        { $match: { Album: { $regex: search, $options: 'i' } } },
        {
          $group: {
            _id: {
              Provider_musicbrainzalbum: '$Provider_musicbrainzalbum',
            },
            Album: { $first: '$Album' },
            Year: { $first: '$Year' },
            Sum: { $sum: '$run_time' },
          },
        },
        { $sort: { Sum: -1 } },
        {
          $project: {
            _id: 0,
            Album: 1,
            Year: 1,
            Provider_musicbrainzalbum: '$_id.Provider_musicbrainzalbum',
          },
        },
      ])
      .exec();

    const artists = await this.songModel
      .aggregate([
        { $match: { Artist: { $regex: search, $options: 'i' } } },
        {
          $group: {
            _id: {
              Provider_musicbrainzartist: '$Provider_musicbrainzartist',
            },
            Artist: { $first: '$Artist' },
            Sum: { $sum: '$run_time' },
          },
        },
        { $sort: { Sum: -1 } },
        {
          $project: {
            _id: 0,
            Artist: 1,
            Provider_musicbrainzartist: '$_id.Provider_musicbrainzartist',
          },
        },
      ])
      .exec();

    const songs = await this.songModel
      .aggregate([
        { $match: { Name: { $regex: search, $options: 'i' } } },
        {
          $group: {
            _id: {
              Provider_musicbrainztrack: '$Provider_musicbrainztrack',
            },
            Name: { $first: '$Name' },
            Provider_musicbrainzalbum: { $first: '$Provider_musicbrainzalbum' },
            Sum: { $sum: '$run_time' },
          },
        },
        { $sort: { Sum: -1 } },
        {
          $project: {
            _id: 0,
            Song: '$Name',
            Provider_musicbrainzalbum: 1,
            Provider_musicbrainztrack: '$_id.Provider_musicbrainztrack',
          },
        },
      ])
      .exec();

    return new SearchResultDto(albums, artists, songs);
  }

  async ensureDatabaseStructureIsCorrect(): Promise<void> {
    // Fix wrong types

    await this.songModel
      .updateMany({ Year: { $type: 'string' } }, [
        { $set: { Year: { $toInt: '$Year' } } },
      ])
      .exec();

    await this.songModel
      .updateMany({ playback_position_seconds: { $type: 'string' } }, [
        {
          $set: {
            playback_position_seconds: {
              $toDouble: '$playback_position_seconds',
            },
          },
        },
      ])
      .exec();

    await this.songModel
      .updateMany({ run_time: { $type: 'string' } }, [
        { $set: { run_time: { $toDouble: '$run_time' } } },
      ])
      .exec();
  }
}
