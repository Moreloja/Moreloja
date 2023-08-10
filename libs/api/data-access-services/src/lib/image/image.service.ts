import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { AxiosError } from 'axios';

// This is a hack to make Multer available in the Express namespace
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
import 'multer';

import {
  GetImageResponseDto,
  UploadImageResponseDto,
} from '@moreloja/api/data-access-dtos';
import { ImageRepository } from '@moreloja/api/data-access-repositories';
import {
  InjectPictrsConfig,
  PictrsConfiguration,
} from '@moreloja/api/configurations';

@Injectable()
export class ImageService {
  constructor(
    @InjectPictrsConfig()
    private readonly pictrsConfiguration: PictrsConfiguration,
    private readonly httpService: HttpService,
    private readonly imageRepository: ImageRepository
  ) {}

  async getAlbumCover(musicbrainzalbum: string): Promise<GetImageResponseDto> {
    // Get image from db
    const existingImage = await this.imageRepository.getImageByMusicBrainzAlbum(
      musicbrainzalbum
    );
    if (existingImage) {
      return new GetImageResponseDto(existingImage);
    }
    try {
      // Else Get image from coverart api
      const coverUrl = this.getCoverUrl(musicbrainzalbum);
      const response = await this.getUploadImage(coverUrl);
      // Add db entry for uploaded image
      this.saveOrUpdateImageMetadata(musicbrainzalbum, response);
      return new GetImageResponseDto(response.files[0].file);
    } catch (error) {
      // TODO Maybe throw error instead.
      // Placeholder image is already set before calling this method.
      return new GetImageResponseDto(
        // TODO Use static image instead
        '2d8649a6-96ff-48d5-a133-36da61261edd.webp'
      );
    }
  }

  async setAlbumCover(
    musicbrainzalbum: string,
    image: Express.Multer.File
  ): Promise<GetImageResponseDto> {
    const formData = new FormData();
    const blob = new Blob([image.buffer], {
      type: image.mimetype,
    });
    formData.append('images[]', blob, image.originalname);
    const response = await firstValueFrom(
      this.httpService
        .post<UploadImageResponseDto>(
          this.pictrsConfiguration.domain + '/image',
          formData
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error('An error occurred:', error.message);
            throw 'An error happened while setting album cover!';
          })
        )
    );

    this.saveOrUpdateImageMetadata(musicbrainzalbum, response.data);
    return new GetImageResponseDto(response.data.files[0].file);
  }

  private async saveOrUpdateImageMetadata(
    musicbrainzalbum: string,
    response: UploadImageResponseDto
  ) {
    this.imageRepository.saveOrUpdateImageMetadata(
      musicbrainzalbum,
      response.files[0].file
    );
  }

  private getCoverUrl(musicbrainzalbum: string): string {
    return `https://coverartarchive.org/release/${musicbrainzalbum}/front-250`;
  }

  private async getUploadImage(
    coverUrl: string
  ): Promise<UploadImageResponseDto> {
    console.log('Loading cover for: ' + coverUrl);
    const pictrsImageDownloadUrl = `${this.pictrsConfiguration.domain}/image/download?url=${coverUrl}&backgrounded=false`;

    const response = await firstValueFrom(
      this.httpService.get<UploadImageResponseDto>(pictrsImageDownloadUrl).pipe(
        timeout(5000),
        catchError((error: AxiosError) => {
          console.error('An error occurred:', error.message);
          throw 'An error happened in method getUploadImage!';
        })
      )
    );

    return response.data;
  }
}
