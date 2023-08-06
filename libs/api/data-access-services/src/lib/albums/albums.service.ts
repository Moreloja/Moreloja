import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  GetAlbumResponseDto,
  SongDto,
  TopSongDto,
} from '@moreloja/api/data-access-dtos';
import { Song } from '@moreloja/api/data-access-models';
import { SongRepository } from '@moreloja/api/data-access-repositories';

@Injectable()
export class AlbumsService {
  constructor(
    @InjectModel(Song.name) private songModel: Model<Song>,
    private songRepository: SongRepository
  ) {}

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
            song.run_time ?? 0
          )
      )
    );
  }
}
