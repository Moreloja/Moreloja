import { Controller, Get, Param } from '@nestjs/common';

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
}
