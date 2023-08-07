import { Injectable } from '@nestjs/common';

import {
  AlbumDto,
  GetArtistResponseDto,
  SongDto,
  TopSongDto,
} from '@moreloja/api/data-access-dtos';
import { SongRepository } from '@moreloja/api/data-access-repositories';

@Injectable()
export class ArtistsService {
  constructor(private songRepository: SongRepository) {}

  async getArtist(mbidAlbumArtist: string): Promise<GetArtistResponseDto> {
    const albumArtistFilter = {
      Provider_musicbrainzalbumartist: mbidAlbumArtist,
    };

    const songs = await this.songRepository.findLimitedSongs(
      albumArtistFilter,
      10
    );

    let artistName = '';
    if (songs.length) {
      artistName = songs[0].Artist ?? 'Unknown Artist';
    }

    const topSongs = await this.songRepository.getTopSongs(
      albumArtistFilter,
      10
    );

    const distinctAlbums = await this.songRepository.getDistinctAlbums(
      albumArtistFilter
    );

    return new GetArtistResponseDto(
      artistName,
      distinctAlbums.map(
        (album) =>
          new AlbumDto(album.Album ?? '', album.Provider_musicbrainzalbum ?? '', 
            album.Year ?? '')
      ),
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
            song.Provider_musicbrainztrack ?? '',
            song.run_time ?? 0
          )
      )
    );
  }
}
