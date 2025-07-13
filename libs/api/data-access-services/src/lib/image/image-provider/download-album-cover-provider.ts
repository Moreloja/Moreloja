import { Injectable, Logger } from '@nestjs/common';

import {
  InjectAlbumArtProvidersConfig,
  AlbumArtProvidersConfiguration,
  ArtProviderSource,
} from '@moreloja/api/configurations';

import { UploadImageResponse } from '@moreloja/api/data-access-dtos';
import { ImageRepository } from '@moreloja/api/data-access-repositories';

import { MusicBrainzAlbumCoverProvider } from './musicbrainz-album-cover-provider';
import { DeezerAlbumCoverProvider } from './deezer-album-cover-provider';
import { PictrsService } from '../pictrs.service';

@Injectable()
export class DownloadAlbumCoverProvider {
  constructor(
    @InjectAlbumArtProvidersConfig()
    private readonly albumArtProvidersConfiguration: AlbumArtProvidersConfiguration,
    private readonly pictrsService: PictrsService,
    private readonly imageRepository: ImageRepository,
    private readonly musicBrainzAlbumCoverProvider: MusicBrainzAlbumCoverProvider,
    private readonly deezerAlbumCoverProvider: DeezerAlbumCoverProvider,
  ) {}
  async provideImage(musicbrainzalbum: string): Promise<string> {
    for await (const coverUrl of this.getAlbumCoverFromProvider(
      musicbrainzalbum,
    )) {
      try {
        // Upload image to pictrs
        const response = await this.pictrsService.getUploadImage(coverUrl);
        // Add db entry for uploaded image
        await this.saveOrUpdateImageMetadata(musicbrainzalbum, response);
        return response.files[0].file;
      } catch (error) {
        Logger.debug('Failed to upload cover to pictrs. Error: ' + error);
      }
    }
    throw new Error('No cover found.');
  }

  private async saveOrUpdateImageMetadata(
    musicbrainzalbum: string,
    response: UploadImageResponse,
  ) {
    await this.imageRepository.saveOrUpdateImageMetadata(
      musicbrainzalbum,
      response.files[0].file,
    );
  }

  private async *getAlbumCoverFromProvider(
    musicbrainzalbum: string,
  ): AsyncGenerator<string> {
    const providerMap: Record<
      ArtProviderSource,
      { provideAlbumCover: (musicbrainzalbum: string) => Promise<string> }
    > = {
      MusicBrainz: this.musicBrainzAlbumCoverProvider,
      Deezer: this.deezerAlbumCoverProvider,
    };

    const albumCoverProviders =
      this.albumArtProvidersConfiguration.providers.map(
        (providerName: ArtProviderSource) => providerMap[providerName],
      );
    Logger.debug('Album cover providers: ' + albumCoverProviders);
    if (!albumCoverProviders) {
      Logger.debug('No album cover providers configured.');
      return;
    }

    for (const provider of albumCoverProviders) {
      try {
        Logger.debug('Trying provider: ' + provider);
        yield await provider.provideAlbumCover(musicbrainzalbum);
      } catch (error) {
        Logger.debug('No cover found. Trying next provider... Error: ' + error);
      }
    }
  }
}
