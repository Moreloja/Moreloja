import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Song } from '@moreloja/api/data-access-models';

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
    skip?: number,
    limit?: number
  ): Promise<
    { Provider_musicbrainzalbum: string; Album: string; Year: number }[]
  > {
    return await this.songModel.aggregate([
      { $match: albumArtistFilter },
      {
        $group: {
          _id: '$Provider_musicbrainzalbum',
          Album: { $first: '$Album' },
          Year: { $first: '$Year' },
        },
      },
      { $sort: { Year: -1, _id: 1 } },
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
        },
      },
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
      { $sort: { playCount: -1, _id: 1 } },
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
}
