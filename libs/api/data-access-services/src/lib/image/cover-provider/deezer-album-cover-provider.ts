import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { AxiosError } from 'axios';

import { SongRepository } from '@moreloja/api/data-access-repositories';

@Injectable()
export class DeezerAlbumCoverProvider {
  constructor(
    private readonly httpService: HttpService,
    private readonly songRepository: SongRepository
  ) {}
  async provideAlbumCover(musicbrainzalbum: string): Promise<string> {
    const document =
      await this.songRepository.getArtistAndAlbumByMusicbrainzalbumId(
        musicbrainzalbum
      );
    if (document) {
      const deezerCoverUrl = await this.getCoverUrlDeezer(
        document.artist,
        document.album
      );

      return deezerCoverUrl;
    }
    throw new Error('No deezer image found.');
  }

  private async getCoverUrlDeezer(
    artist: string,
    album: string
  ): Promise<string> {
    const response = await firstValueFrom(
      this.httpService
        .get<any>(`https://api.deezer.com/search?q=${artist} ${album}`)
        .pipe(
          timeout(5000),
          catchError((error: AxiosError) => {
            console.error('An error occurred:', error.message);
            throw 'An error happened in method getCoverUrlDeezer!';
          })
        )
    );

    return response.data.data[0].album.cover_xl;
  }
}
