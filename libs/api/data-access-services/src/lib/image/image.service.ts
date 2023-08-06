import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AxiosError } from 'axios';

import { Image } from '@moreloja/api/data-access-models';
import {
  GetImageResponseDto,
  UploadImageResponseDto,
} from '@moreloja/api/data-access-dtos';

@Injectable()
export class ImageService {
  private apiURL = 'http://localhost:8080'; // TODO Make config environment variable

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Image.name) private imageModel: Model<Image>
  ) {}

  async getAlbumCover(musicbrainzalbum: string): Promise<GetImageResponseDto> {
    // TODO Use same host as this nestjs to build image url
    // this means that pict-rs does not have to be publicly available
    // and can stay internal
    const url = this.apiURL + '/image/original/';
    // Get image from db
    const existingImage = await this.getImageByMusicBrainzAlbum(
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

  async getImageByMusicBrainzAlbum(
    musicbrainzalbum: string
  ): Promise<string | undefined> {
    const query = { musicbrainzid: musicbrainzalbum };
    const projection = { _id: 0, image: 1 };

    const result = await this.imageModel.findOne(query, projection).exec();

    if (result) {
      return result.image;
    } else {
      return undefined;
    }
  }

  async getAlbumCoverFromMusicBrainz(musicbrainzalbum: string): Promise<Blob> {
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

  async saveUploadedImageMetadata(
    musicbrainzalbum: string,
    response: UploadImageResponseDto
  ) {
    const newImage = new this.imageModel({
      musicbrainzid: musicbrainzalbum,
      image: response.files[0].file,
    });

    try {
      await newImage.save();
    } catch (error) {
      // Happens if image already exists. Not saving again.
      console.debug('Image already exists. Not saving again.');
    }
  }

  async uploadImage(image: Blob): Promise<UploadImageResponseDto> {
    const formData = new FormData();
    formData.append('images[]', new File([image], 'image.jpg'));

    const response = await firstValueFrom(
      this.httpService
        .post<UploadImageResponseDto>(this.apiURL + '/image', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
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
