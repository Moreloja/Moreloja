import { Controller, Get, Param } from '@nestjs/common';

import { ArtistsService } from '@moreloja/api/data-access-services';
import {
  GetArtistResponse,
  GetArtistsResponse,
} from '@moreloja/api/data-access-dtos';

@Controller()
export class ArtistsController {
  constructor(private readonly artistsService: ArtistsService) {}

  @Get('artist/:mbidAlbumArtist')
  getArtist(
    @Param('mbidAlbumArtist') mbidAlbumArtist: string
  ): Promise<GetArtistResponse> {
    return this.artistsService.getArtist(mbidAlbumArtist);
  }

  @Get('artists/:range/page/:page')
  getArtists(
    @Param('range') range: string,
    @Param('page') page: number
  ): Promise<GetArtistsResponse> {
    return this.artistsService.getArtists(range, page);
  }
}
