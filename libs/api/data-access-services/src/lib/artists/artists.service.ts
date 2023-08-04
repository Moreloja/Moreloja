import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { GetArtistResponseDto, SongDto } from '@moreloja/api/data-access-dtos';
import { Song } from '@moreloja/api/data-access-models';

@Injectable()
export class ArtistsService {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  async getArtist(mbidAlbumArtist: string): Promise<GetArtistResponseDto> {
    const songs = await this.songModel
      .find({ Provider_musicbrainzalbumartist: mbidAlbumArtist })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(10)
      .exec();

    return new GetArtistResponseDto(
      "TODO Name",
      [],
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
