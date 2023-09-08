import { Injectable } from '@nestjs/common';

import { ImageRepository } from '@moreloja/api/data-access-repositories';
import { PlaceholderArtistCover } from '@moreloja/shared/global-constants';

@Injectable()
export class PlaceholderArtistCoverProvider {
  constructor(private readonly imageRepository: ImageRepository) {}

  async provideImage(musicbrainzartist: string): Promise<string> {
    const coverUrl = await this.imageRepository.getImageByMusicBrainzId(
      PlaceholderArtistCover
    );
    if (coverUrl) {
      this.imageRepository.saveOrUpdateImageMetadata(
        musicbrainzartist,
        coverUrl
      );
      return coverUrl;
    }

    throw new Error(
      'This should never happen! Placeholder image should be uploaded on first start.'
    );
  }
}
