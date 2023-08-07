import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import {
  GetAllSongsResponseDto,
  SongDto,
} from '@moreloja/api/data-access-dtos';
import { Song } from '@moreloja/api/data-access-models';

@Injectable()
export class SongsService {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  async getAllSongs(): Promise<GetAllSongsResponseDto> {
    const songs = await this.songModel
      .find()
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(10)
      .exec();
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
            song.Provider_musicbrainztrack ?? '',
            song.run_time ?? 0
          )
      )
    );
  }
}
