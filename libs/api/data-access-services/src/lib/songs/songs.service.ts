import { Injectable } from '@nestjs/common';

import {
  GetAllSongsResponseDto,
  SongDto,
} from '@moreloja/api/data-access-dtos';
import { SongRepository } from '@moreloja/api/data-access-repositories';
import { Song } from '@moreloja/api/data-access-models';

@Injectable()
export class SongsService {
  private readonly songsPerPage = 25;

  constructor(private songRepository: SongRepository) {}

  async getAllSongs(
    mbidArtist: string,
    page: number
  ): Promise<GetAllSongsResponseDto> {
    let filter = {};

    if (mbidArtist !== 'undefined') {
      filter = { Provider_musicbrainzartist: mbidArtist };
    }

    const songs = await this.songRepository.findLimitedSongs(
      filter,
      this.songsToSkip(page),
      this.songsPerPage
    );
    return this.createGetAllSongsResponseDto(songs);
  }

  async getAllSongsByTrack(
    mbidTrack: string,
    page: number
  ): Promise<GetAllSongsResponseDto> {
    const songs = await this.songRepository.findLimitedSongs(
      { Provider_musicbrainztrack: mbidTrack },
      this.songsToSkip(page),
      this.songsPerPage
    );
    return this.createGetAllSongsResponseDto(songs);
  }

  private createGetAllSongsResponseDto(songs: Song[]): GetAllSongsResponseDto {
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

  private songsToSkip(page: number): number {
    const result = (page - 1) * this.songsPerPage;
    return result < 0 ? 0 : result;
  }
}
