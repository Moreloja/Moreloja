import { Controller, Get, Param } from '@nestjs/common';

import { AlbumsService } from '@moreloja/api/data-access-services';
import { GetAlbumResponseDto } from '@moreloja/api/data-access-dtos';

@Controller()
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get('album/:mbidAlbum')
  getAlbum(@Param('mbidAlbum') mbidAlbum: string): Promise<GetAlbumResponseDto> {
    return this.albumsService.getAlbum(mbidAlbum);
  }
}
