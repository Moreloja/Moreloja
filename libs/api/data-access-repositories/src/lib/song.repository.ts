import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Song } from '@moreloja/api/data-access-models';
import { Order, Sort } from '@moreloja/shared/global-constants';

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
    limit?: number
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
    limit?: number
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
    limit?: number
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
    musicbrainzalbum: string
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
    mbidArtist: string
  ): Promise<{ artist: string } | undefined> {
    const song = await this.songModel
      .findOne({ Provider_musicbrainzartist: mbidArtist })
      .exec();
    if (song) {
      return { artist: song.Artist ?? '' };
    }

    return undefined;
  }
}
