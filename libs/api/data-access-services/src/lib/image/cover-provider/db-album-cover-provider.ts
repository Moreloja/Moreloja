import { Injectable } from '@nestjs/common';

import { ImageRepository } from '@moreloja/api/data-access-repositories';

@Injectable()
export class DbAlbumCoverProvider {
  constructor(private readonly imageRepository: ImageRepository) {}
  async provideAlbumCover(musicbrainzalbum: string): Promise<string> {
    const existingImage = await this.imageRepository.getImageByMusicBrainzAlbum(
      musicbrainzalbum
    );
    if (existingImage) {
      return existingImage;
    }
    throw new Error('No image found in the database.');
  }
}
