import { Injectable } from '@nestjs/common';

import { ImageRepository } from '@moreloja/api/data-access-repositories';

@Injectable()
export class DbImageProvider {
  constructor(private readonly imageRepository: ImageRepository) {}
  async provideImage(musicBrainzId: string): Promise<string> {
    const existingImage = await this.imageRepository.getImageByMusicBrainzId(
      musicBrainzId
    );
    if (existingImage) {
      return existingImage;
    }
    throw new Error('No image found in the database.');
  }
}
