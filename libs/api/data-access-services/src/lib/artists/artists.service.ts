import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  AlbumDto,
  GetArtistResponseDto,
  SongDto,
  TopSongDto,
} from '@moreloja/api/data-access-dtos';
import { Song } from '@moreloja/api/data-access-models';

@Injectable()
export class ArtistsService {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  async getArtist(mbidAlbumArtist: string): Promise<GetArtistResponseDto> {
    const albumArtistFilter = {
      Provider_musicbrainzalbumartist: mbidAlbumArtist,
    };

    const songs = await this.songModel
      .find(albumArtistFilter)
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(10)
      .exec();

    let artistName = '';
    if (songs.length) {
      artistName = songs[0].Artist ?? 'Unknown Artist';
    }

    const topSongs = await this.songModel.aggregate([
      { $match: albumArtistFilter },
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
      { $limit: 10 },
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

    const distinctAlbums = await this.songModel.aggregate([
      { $match: albumArtistFilter },
      {
        $group: {
          _id: '$Album',
          Provider_musicbrainzalbum: { $first: '$Provider_musicbrainzalbum' },
        },
      },
      { $project: { _id: 0, Album: '$_id', Provider_musicbrainzalbum: 1 } },
    ]);

    return new GetArtistResponseDto(
      artistName,
      distinctAlbums.map(
        (album) =>
          new AlbumDto(album.Album ?? '', album.Provider_musicbrainzalbum ?? '')
      ),
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
