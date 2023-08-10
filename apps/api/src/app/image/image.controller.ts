import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

// This is a hack to make Multer available in the Express namespace
// See https://github.com/DefinitelyTyped/DefinitelyTyped/issues/47780
import 'multer';

import { ImageService } from '@moreloja/api/data-access-services';
import { GetImageResponseDto } from '@moreloja/api/data-access-dtos';

@Controller()
export class ImageController {
  constructor(private readonly imageService: ImageService) {}

  @Get('image/album/:musicbrainzalbum')
  getAlbumCover(
    @Param('musicbrainzalbum') musicbrainzalbum: string
  ): Promise<GetImageResponseDto> {
    return this.imageService.getAlbumCover(musicbrainzalbum);
  }

  @Post('image/album/:musicbrainzalbum')
  @UseInterceptors(FileInterceptor('image'))
  setAlbumCover(
    @Param('musicbrainzalbum') musicbrainzalbum: string,
    @UploadedFile() image: Express.Multer.File
  )
  : Promise<GetImageResponseDto>
  {
    return this.imageService.setAlbumCover(musicbrainzalbum, image);
  }
}
