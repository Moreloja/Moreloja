import { Controller, Get, Param } from '@nestjs/common';

import { ArtistsService } from '@moreloja/api/data-access-services';

@Controller()
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get('artist/:mbidAlbumArtist')
  getArtist(@Param('mbidAlbumArtist') mbidAlbumArtist: string) {
    return this.artistsService.getArtist(mbidAlbumArtist);
  }
}
