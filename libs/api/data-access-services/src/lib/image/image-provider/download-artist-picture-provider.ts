import { Injectable, Logger } from '@nestjs/common';

import {
  InjectArtistArtProvidersConfig,
  ArtistArtProvidersConfiguration,
  ArtistArtProviderSource,
} from '@moreloja/api/configurations';
import { UploadImageResponse } from '@moreloja/api/data-access-dtos';
import { ImageRepository } from '@moreloja/api/data-access-repositories';

import { PictrsService } from '../pictrs.service';
import { DeezerArtistPictureProvider } from './deezer-artist-picture-provider';

@Injectable()
export class DownloadArtistPictureProvider {
  constructor(
    @InjectArtistArtProvidersConfig()
    private readonly artistArtProvidersConfiguration: ArtistArtProvidersConfiguration,
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
        Logger.debug('Failed to upload cover to pictrs. Error: ' + error);
      }
    }
    throw new Error('No cover found.');
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

  private async *getArtistPictureFromProvider(
    musicBrainzId: string,
  ): AsyncGenerator<string> {
    const providerMap: Record<
      ArtistArtProviderSource,
      { provideImage(musicbrainzalbum: string): Promise<string> }
    > = {
      Deezer: this.deezerArtistPictureProvider,
    };

    const artistArtProviders =
      this.artistArtProvidersConfiguration.providers.map(
        (providerName: ArtistArtProviderSource) => providerMap[providerName],
      );
    Logger.debug('Artist art providers: ' + artistArtProviders);
    if (!artistArtProviders) {
      Logger.debug('No artist art providers configured.');
      return;
    }

    for (const provider of artistArtProviders) {
      try {
        Logger.debug('Trying provider: ' + provider);
        yield await provider.provideImage(musicBrainzId);
      } catch (error) {
        Logger.debug(
          'No artist picture found. Trying next provider... Error: ' + error,
        );
      }
    }
  }
}
