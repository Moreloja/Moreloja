import { Injectable } from '@nestjs/common';

import { UploadImageResponse } from '@moreloja/api/data-access-dtos';
import { ImageRepository } from '@moreloja/api/data-access-repositories';

import { PictrsService } from '../pictrs.service';
import { DeezerArtistPictureProvider } from './deezer-artist-picture-provider';

@Injectable()
export class DownloadArtistPictureProvider {
  constructor(
    private readonly pictrsService: PictrsService,
    private readonly imageRepository: ImageRepository,
    private readonly deezerArtistPictureProvider: DeezerArtistPictureProvider,
  ) {}
  async provideImage(musicBrainzId: string): Promise<string> {
    for await (const coverUrl of this.getArtistPictureFromProvider(
      musicBrainzId,
    )) {
      try {
        // Upload image to pictrs
        const response = await this.pictrsService.getUploadImage(coverUrl);
        // Add db entry for uploaded image
        await this.saveOrUpdateImageMetadata(musicBrainzId, response);
        return response.files[0].file;
      } catch (error) {
        console.log('Failed to upload cover to pictrs. Error: ' + error);
      }
    }
    throw new Error('No cover found.');
  }

  private async *getArtistPictureFromProvider(musicBrainzId: string) {
    const artistPictureProviders: {
      provideImage(musicbrainzalbum: string): Promise<string>;
    }[] = [this.deezerArtistPictureProvider];

    for (const provider of artistPictureProviders) {
      try {
        yield provider.provideImage(musicBrainzId);
      } catch (error) {
        console.log(
          'No artist picture found. Trying next provider... Error: ' + error,
        );
      }
    }
  }

  private async saveOrUpdateImageMetadata(
    musicBrainzId: string,
    response: UploadImageResponse,
  ) {
    await this.imageRepository.saveOrUpdateImageMetadata(
      musicBrainzId,
      response.files[0].file,
    );
  }
}
