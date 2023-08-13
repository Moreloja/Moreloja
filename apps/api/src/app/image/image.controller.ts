import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// This is a hack to make Multer available in the Express namespace
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
import 'multer';

import {
  ImageService,
  NoCoverFoundError,
} from '@moreloja/api/data-access-services';
import { GetImageResponseDto } from '@moreloja/api/data-access-dtos';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('image/album/:musicbrainzalbum')
  async getAlbumCover(
    @Param('musicbrainzalbum') musicbrainzalbum: string
  ): Promise<GetImageResponseDto> {
    try {
      return await this.imageService.getAlbumCover(musicbrainzalbum);
    } catch (error) {
      if (error instanceof NoCoverFoundError) {
        throw new NotFoundException('No cover found at all.');
      }
      throw error;
    }
  }

  @Post('image/album/:musicbrainzalbum')
  @UseInterceptors(FileInterceptor('image'))
  setAlbumCover(
    @Param('musicbrainzalbum') musicbrainzalbum: string,
    @UploadedFile() image: Express.Multer.File
  ): Promise<GetImageResponseDto> {
    return this.imageService.setAlbumCover(musicbrainzalbum, image);
  }
}
