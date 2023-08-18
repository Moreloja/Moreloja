import { Injectable } from '@nestjs/common';

import {
  GetAlbumResponseDto,
  GetAlbumsResponseDto,
  SongDto,
  TopSongDto,
} from '@moreloja/api/data-access-dtos';
import { SongRepository } from '@moreloja/api/data-access-repositories';
import { PaginationService } from '../pagination.service';

@Injectable()
export class AlbumsService {
  constructor(
    private songRepository: SongRepository,
    private paginationService: PaginationService
  ) {}

  async getAlbum(mbidAlbum: string): Promise<GetAlbumResponseDto> {
    const albumFilter = {
      Provider_musicbrainzalbum: mbidAlbum,
    };

    const songs = await this.songRepository.findLimitedSongs(
      albumFilter,
      0,
      10
    );

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
            song.Provider_musicbrainzartist ?? '',
            song.Provider_musicbrainztrack ?? '',
            song.run_time ?? 0
          )
      )
    );
  }

  async getAlbums(page: number): Promise<GetAlbumsResponseDto> {
    const albums = await this.songRepository.getDistinctAlbums(
      {},
      this.paginationService.pagesToSkip(page),
      this.paginationService.itemsPerPage
    );
    return new GetAlbumsResponseDto(albums);
  }
}
