import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { GetAllSongsResponseDto } from '@moreloja/api/data-access-dtos';
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
    return {
      songs: songs.map((song) => ({
        Album: song.Album ?? '',
        Artist: song.Artist ?? '',
        Name: song.Name ?? '',
        timestamp: song.timestamp ?? '',
        Provider_musicbrainzalbum: song.Provider_musicbrainzalbum ?? '',
        Provider_musicbrainzalbumartist: song.Provider_musicbrainzalbumartist ?? '',
        run_time: song.run_time ?? 0,
      })),
    };
  }
}
