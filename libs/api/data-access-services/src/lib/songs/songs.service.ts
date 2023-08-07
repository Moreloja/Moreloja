import { Injectable } from '@nestjs/common';

import {
  GetAllSongsResponseDto,
  SongDto,
} from '@moreloja/api/data-access-dtos';
import { SongRepository } from '@moreloja/api/data-access-repositories';

@Injectable()
export class SongsService {
  constructor(private songRepository: SongRepository) {}

  async getAllSongs(): Promise<GetAllSongsResponseDto> {
    const songs = await this.songRepository.findLimitedSongs({}, 10);
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
