import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Song } from '@moreloja/api/data-access-models';

@Injectable()
export class SongRepository {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  async findLimitedSongs(albumArtistFilter: any, limit: number) {
    return await this.songModel
      .find(albumArtistFilter)
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(limit)
      .exec();
  }

  async getDistinctAlbums(
    albumArtistFilter: any
  ): Promise<{ Provider_musicbrainzalbum: string; Album: string }[]> {
    return await this.songModel.aggregate([
      { $match: albumArtistFilter },
      {
        $group: {
          _id: '$Provider_musicbrainzalbum',
          Album: { $first: '$Album' },
        },
      },
      { $project: { _id: 0, Provider_musicbrainzalbum: '$_id', Album: 1 } },
    ]);
  }

  async getTopSongs(songFilter: any, limit?: number): Promise<any[]> {
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
      { $sort: { playCount: -1 } },
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
}
