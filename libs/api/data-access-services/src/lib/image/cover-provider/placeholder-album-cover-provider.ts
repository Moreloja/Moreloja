import { Injectable } from '@nestjs/common';

import { ImageRepository } from '@moreloja/api/data-access-repositories';

@Injectable()
export class PlaceholderAlbumCoverProvider {
  placeholderMusicbrainzid = '00000000-0000-0000-0000-000000000000';
  constructor(private readonly imageRepository: ImageRepository) {}

  async provideAlbumCover(musicbrainzalbum: string): Promise<string> {
    const coverUrl = await this.imageRepository.getImageByMusicBrainzAlbum(
      this.placeholderMusicbrainzid
    );
    if (coverUrl) {
      this.imageRepository.saveOrUpdateImageMetadata(
        musicbrainzalbum,
        coverUrl
      );
      return coverUrl;
    }

    throw new Error(
      'This should never happen! Placeholder image should be uploaded on first start.'
    );
  }
}
