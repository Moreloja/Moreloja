import { Injectable } from '@nestjs/common';

// This is a hack to make Multer available in the Express namespace
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
import 'multer';

import {
  GetImageResponse,
  UploadImageResponse,
} from '@moreloja/api/data-access-dtos';
import { ImageRepository } from '@moreloja/api/data-access-repositories';

import { PictrsService } from './pictrs.service';
import {
  DbImageProvider,
  DownloadAlbumCoverProvider,
  DownloadArtistPictureProvider,
  PlaceholderAlbumCoverProvider,
  PlaceholderArtistCoverProvider,
} from './image-provider';
import { NoCoverFoundError } from '../errors';
import { readFile } from 'fs';
import { join } from 'path';
import { PlaceholderAlbumCover, PlaceholderArtistCover } from '@moreloja/shared/global-constants';

@Injectable()
export class ImageService {
  constructor(
    private readonly pictrsService: PictrsService,
    private readonly imageRepository: ImageRepository,
    private readonly dbImageProvider: DbImageProvider,
    private readonly downloadAlbumCoverProvider: DownloadAlbumCoverProvider,
    private readonly downloadArtistPictureProvider: DownloadArtistPictureProvider,
    private readonly placeholderAlbumCoverProvider: PlaceholderAlbumCoverProvider,
    private readonly placeholderArtistCoverProvider: PlaceholderArtistCoverProvider
  ) {}

  async getAlbumCover(musicbrainzalbum: string): Promise<GetImageResponse> {
    const pictrsImageResponseCreators: {
      provideImage(musicbrainzalbum: string): Promise<string>;
    }[] = [
      this.dbImageProvider,
      this.downloadAlbumCoverProvider,
      this.placeholderAlbumCoverProvider,
    ];

    for (const pictrsImageResponseCreator of pictrsImageResponseCreators) {
      try {
        const coverUrl = await pictrsImageResponseCreator.provideImage(
          musicbrainzalbum
        );
        return new GetImageResponse(coverUrl);
      } catch (error) {
        console.log('No cover found. Trying next provider...');
      }
    }

    throw new NoCoverFoundError('No cover found at all.');
  }

  async getArtistPicture(mbidArtist: string): Promise<GetImageResponse> {
    const pictrsImageResponseCreators: {
      provideImage(musicbrainzalbum: string): Promise<string>;
    }[] = [
      this.dbImageProvider,
      this.downloadArtistPictureProvider,
      this.placeholderArtistCoverProvider,
    ];

    for (const pictrsImageResponseCreator of pictrsImageResponseCreators) {
      try {
        const url = await pictrsImageResponseCreator.provideImage(mbidArtist);
        return new GetImageResponse(url);
      } catch (error) {
        console.log('No image found. Trying next provider...');
      }
    }

    throw new Error('No artist image found at all.');
  }

  async setAlbumCover(
    musicbrainzalbum: string,
    image: Express.Multer.File
  ): Promise<GetImageResponse> {
    const response = await this.pictrsService.uploadImage(image);
    await this.saveOrUpdateImageMetadata(musicbrainzalbum, response);
    return new GetImageResponse(response.files[0].file);
  }

  async ensurePlaceholderExists(placeholderId: string, imageName: string): Promise<void> {
    const existingImage = await this.imageRepository.getImageByMusicBrainzId(
      placeholderId
    );
    if (existingImage) {
      return;
    }

    console.log('Placeholder album cover not found in db. Creating...');

    // If placeholder does not exist: Upload placeholder image to pictrs
    readFile(
      join(process.cwd(), 'assets', imageName),
      async (err, data) => {
        if (err) {
          console.error(err);
        } else {
          const response = await this.pictrsService.uploadImageBuffer(data);
          await this.saveOrUpdateImageMetadata(placeholderId, response);
        }
      }
    );
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
