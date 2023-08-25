import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom, timeout } from 'rxjs';
import { AxiosError } from 'axios';

import { UploadImageResponse } from '@moreloja/api/data-access-dtos';
import {
  InjectPictrsConfig,
  PictrsConfiguration,
} from '@moreloja/api/configurations';

@Injectable()
export class PictrsService {
  constructor(
    @InjectPictrsConfig()
    private readonly pictrsConfiguration: PictrsConfiguration,
    private readonly httpService: HttpService
  ) {}

  async getUploadImage(coverUrl: string): Promise<UploadImageResponse> {
    console.log('Loading cover for: ' + coverUrl);
    const pictrsImageDownloadUrl = `${this.pictrsConfiguration.domain}/image/download?url=${coverUrl}&backgrounded=false`;

    const response = await firstValueFrom(
      this.httpService.get<UploadImageResponse>(pictrsImageDownloadUrl).pipe(
        timeout(5000),
        catchError((error: AxiosError) => {
          console.error('An error occurred:', error.message);
          throw 'An error happened in method getUploadImage!';
        })
      )
    );

    return response.data;
  }

  async uploadImage(image: Express.Multer.File): Promise<UploadImageResponse> {
    const formData = new FormData();
    const blob = new Blob([image.buffer], {
      type: image.mimetype,
    });
    formData.append('images[]', blob, image.originalname);
    return await this.postAlbumCover(formData);
  }

  async uploadImageBuffer(image: Buffer): Promise<UploadImageResponse> {
    const formData = new FormData();
    const blob = new Blob([image.buffer]);
    formData.append('images[]', blob);
    return await this.postAlbumCover(formData);
  }

  private async postAlbumCover(
    formData: FormData
  ): Promise<UploadImageResponse> {
    const response = await firstValueFrom(
      this.httpService
        .post<UploadImageResponse>(
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
    return response.data;
  }
}
