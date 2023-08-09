import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import {
  GetImageResponseDto,
  UploadImageResponseDto,
} from '@moreloja/api/data-access-dtos';
import { ImageRepository } from '@moreloja/api/data-access-repositories';
import { InjectPictrsConfig, PictrsConfiguration } from '@moreloja/api/configurations';

@Injectable()
export class ImageService {
  constructor(
    @InjectPictrsConfig() private readonly pictrsConfiguration: PictrsConfiguration,
    private readonly httpService: HttpService,
    private readonly imageRepository: ImageRepository
  ) {}

  async getAlbumCover(musicbrainzalbum: string): Promise<GetImageResponseDto> {
    const url = '/pictrs/image/original/';
    // Get image from db
    const existingImage = await this.imageRepository.getImageByMusicBrainzAlbum(
      musicbrainzalbum
    );
    if (existingImage) {
      return new GetImageResponseDto(url + existingImage);
    }
    try {
      // Else Get image from coverart api
      const image = await this.getAlbumCoverFromMusicBrainz(musicbrainzalbum);
      // If image found uplaod it
      const response = await this.uploadImage(image);
      // Add db entry for uploaded image
      this.saveUploadedImageMetadata(musicbrainzalbum, response);
      return new GetImageResponseDto(url + response.files[0].file);
    } catch (error) {
      return new GetImageResponseDto(
        url + '2d8649a6-96ff-48d5-a133-36da61261edd.webp'
      );
    }
  }

  private async getAlbumCoverFromMusicBrainz(musicbrainzalbum: string): Promise<ArrayBuffer> {
    const response = await firstValueFrom(
      this.httpService
        .get(
          `https://coverartarchive.org/release/${musicbrainzalbum}/front-250`,
          {
            responseType: 'arraybuffer',
          }
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error('Image not found on coverartarchive:', error.message);
            throw 'Image not found on coverartarchive!';
          })
        )
    );
    return response.data;
  }

  private async saveUploadedImageMetadata(
    musicbrainzalbum: string,
    response: UploadImageResponseDto
  ) {
    this.imageRepository.saveUploadedImageMetadata(
      musicbrainzalbum,
      response.files[0].file
    );
  }

  private async uploadImage(image: ArrayBuffer): Promise<UploadImageResponseDto> {
    const formData = new FormData();
    formData.append('images[]', new File([image], 'image.jpg'));

    const response = await firstValueFrom(
      this.httpService
        .post<UploadImageResponseDto>(
          this.pictrsConfiguration.domain + '/image',
          formData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.error('An error occurred:', error.message);
            throw 'An error happened!';
          })
        )
    );

    return response.data;
  }
}
