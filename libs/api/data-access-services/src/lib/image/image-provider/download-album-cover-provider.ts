import { Injectable } from '@nestjs/common';

import { UploadImageResponse } from '@moreloja/api/data-access-dtos';
import { ImageRepository } from '@moreloja/api/data-access-repositories';

import { MusicBrainzAlbumCoverProvider } from './musicbrainz-album-cover-provider';
import { DeezerAlbumCoverProvider } from './deezer-album-cover-provider';
import { PictrsService } from '../pictrs.service';

@Injectable()
export class DownloadAlbumCoverProvider {
  constructor(
    private readonly pictrsService: PictrsService,
    private readonly imageRepository: ImageRepository,
    private readonly musicBrainzAlbumCoverProvider: MusicBrainzAlbumCoverProvider,
    private readonly deezerAlbumCoverProvider: DeezerAlbumCoverProvider
  ) {}
  async provideImage(musicbrainzalbum: string): Promise<string> {
    for await (const coverUrl of this.getAlbumCoverFromProvider(
      musicbrainzalbum
    )) {
      try {
        // Upload image to pictrs
        const response = await this.pictrsService.getUploadImage(coverUrl);
        // Add db entry for uploaded image
        await this.saveOrUpdateImageMetadata(musicbrainzalbum, response);
        return response.files[0].file;
      } catch (error) {
        console.log('Failed to upload cover to pictrs. Error: ' + error);
      }
    }
    throw new Error('No cover found.');
  }

  private async *getAlbumCoverFromProvider(musicbrainzalbum: string) {
    const albumCoverProviders: {
      provideAlbumCover(musicbrainzalbum: string): Promise<string>;
    }[] = [this.musicBrainzAlbumCoverProvider, this.deezerAlbumCoverProvider];

    for (const provider of albumCoverProviders) {
      try {
        yield provider.provideAlbumCover(musicbrainzalbum);
      } catch (error) {
        console.log('No cover found. Trying next provider... Error: ' + error);
      }
    }
  }

  private async saveOrUpdateImageMetadata(
    musicbrainzalbum: string,
    response: UploadImageResponse
  ) {
    await this.imageRepository.saveOrUpdateImageMetadata(
      musicbrainzalbum,
      response.files[0].file
    );
  }
}
