import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { GetAlbumResponseDto, SongDto, TopSongDto } from '@moreloja/api/data-access-dtos';
import { Song } from '@moreloja/api/data-access-models';

@Injectable()
export class AlbumsService {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  async getAlbum(mbidAlbum: string): Promise<GetAlbumResponseDto> {
    const albumFilter = {
      Provider_musicbrainzalbum: mbidAlbum,
    };

    const songs = await this.songModel
      .find(albumFilter)
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(10)
      .exec();

    let albumName = '';
    if (songs.length) {
      albumName = songs[0].Album ?? 'Unknown Album';
    }

    // TODO This is nearly the same as in artists.service.ts
    // Create new project for a repository with db methods
    // Difference is that this has a different match filter and no limit
    const topSongs = await this.songModel.aggregate([
      { $match: albumFilter },
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
            song.playCount ?? 0,
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
            song.run_time ?? 0
          )
      )
    );
  }
}
