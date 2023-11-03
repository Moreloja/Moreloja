import { Controller, Get, Param } from '@nestjs/common';

import { AlbumsService } from '@moreloja/api/data-access-services';
import {
  GetAlbumResponseDto,
  GetAlbumsResponseDto,
} from '@moreloja/api/data-access-dtos';

@Controller()
export class AlbumsController {
  constructor(private readonly albumsService: AlbumsService) {}

  @Get('album/:mbidAlbum')
  getAlbum(
    @Param('mbidAlbum') mbidAlbum: string,
  ): Promise<GetAlbumResponseDto> {
    return this.albumsService.getAlbum(mbidAlbum);
  }

  @Get('albums/:range/sort/:sortBy/:order/page/:page')
  getAlbums(
    @Param('range') range: string,
    @Param('sortBy') sortBy: string,
    @Param('order') order: string,
    @Param('page') page: number,
  ): Promise<GetAlbumsResponseDto> {
    return this.albumsService.getAlbums(range, sortBy, order, page);
  }
}
