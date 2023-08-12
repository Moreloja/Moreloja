import { Injectable } from '@nestjs/common';

import {
  GetAllSongsResponseDto,
  SongDto,
} from '@moreloja/api/data-access-dtos';
import { SongRepository } from '@moreloja/api/data-access-repositories';

@Injectable()
export class SongsService {
  constructor(private songRepository: SongRepository) {}

  async getAllSongs(page: number): Promise<GetAllSongsResponseDto> {
    const songsPerPage = 10;
    const songsToSkip = (page - 1) * songsPerPage;
    const songs = await this.songRepository.findLimitedSongs(
      {},
      songsToSkip < 0 ? 0 : songsToSkip,
      songsPerPage
    );
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
            song.Provider_musicbrainzartist ?? '',
            song.Provider_musicbrainztrack ?? '',
            song.run_time ?? 0
          )
      )
    );
  }
}
