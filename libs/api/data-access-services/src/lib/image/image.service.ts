import { Injectable } from '@nestjs/common';

// This is a hack to make Multer available in the Express namespace
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
import 'multer';

import {
  GetImageResponseDto,
  UploadImageResponseDto,
} from '@moreloja/api/data-access-dtos';
import { ImageRepository } from '@moreloja/api/data-access-repositories';

import { PictrsService } from './pictrs.service';
import {
  DbAlbumCoverProvider,
  DownloadAlbumCoverProvider,
} from './cover-provider';

@Injectable()
export class ImageService {
  constructor(
    private readonly pictrsService: PictrsService,
    private readonly imageRepository: ImageRepository,
    private readonly dbAlbumCoverProvider: DbAlbumCoverProvider,
    private readonly downloadAlbumCoverProvider: DownloadAlbumCoverProvider
  ) {}

  async getAlbumCover(musicbrainzalbum: string): Promise<GetImageResponseDto> {
    const pictrsImageResponseCreators: {
      provideAlbumCover(musicbrainzalbum: string): Promise<string>;
    }[] = [
      this.dbAlbumCoverProvider,
      this.downloadAlbumCoverProvider,
      // PlaceholderProvider
      {
        async provideAlbumCover(musicbrainzalbum: string): Promise<string> {
          // TODO Maybe throw error instead.
          // Placeholder image is already set before calling this method.
          // TODO Use static image instead
          return '2d8649a6-96ff-48d5-a133-36da61261edd.webp';
        },
      },
    ];

    for (const pictrsImageResponseCreator of pictrsImageResponseCreators) {
      try {
        const coverUrl = await pictrsImageResponseCreator.provideAlbumCover(
          musicbrainzalbum
        );
        return new GetImageResponseDto(coverUrl);
      } catch (error) {
        console.log('No cover found. Trying next provider...');
      }
    }

    throw new Error('No cover found at all.');
  }

  async setAlbumCover(
    musicbrainzalbum: string,
    image: Express.Multer.File
  ): Promise<GetImageResponseDto> {
    const response = await this.pictrsService.uploadImage(image);
    await this.saveOrUpdateImageMetadata(musicbrainzalbum, response);
    return new GetImageResponseDto(response.files[0].file);
  }

  private async saveOrUpdateImageMetadata(
    musicbrainzalbum: string,
    response: UploadImageResponseDto
  ) {
    await this.imageRepository.saveOrUpdateImageMetadata(
      musicbrainzalbum,
      response.files[0].file
    );
  }
}
