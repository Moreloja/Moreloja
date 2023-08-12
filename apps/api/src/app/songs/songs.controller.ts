import { Controller, Get, Param } from '@nestjs/common';

import { SongsService } from '@moreloja/api/data-access-services';

@Controller()
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get('songs/page/:page')
  getAllSongs(
    @Param('page') page: number
  ) {
    return this.songsService.getAllSongs(page);
  }
}
