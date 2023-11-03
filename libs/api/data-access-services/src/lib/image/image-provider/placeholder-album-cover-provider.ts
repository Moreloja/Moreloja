import { Injectable } from '@nestjs/common';

import { ImageRepository } from '@moreloja/api/data-access-repositories';
import { PlaceholderAlbumCover } from '@moreloja/shared/global-constants';

@Injectable()
export class PlaceholderAlbumCoverProvider {
  constructor(private readonly imageRepository: ImageRepository) {}

  async provideImage(musicbrainzalbum: string): Promise<string> {
    const coverUrl = await this.imageRepository.getImageByMusicBrainzId(
      PlaceholderAlbumCover,
    );
    if (coverUrl) {
      this.imageRepository.saveOrUpdateImageMetadata(
        musicbrainzalbum,
        coverUrl,
      );
      return coverUrl;
    }

    throw new Error(
      'This should never happen! Placeholder image should be uploaded on first start.',
    );
  }
}
