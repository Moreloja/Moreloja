import { Controller, Get } from '@nestjs/common';

import { SongsService } from '@moreloja/api/data-access-services';

@Controller()
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get('songs')
  getAllSongs() {
    return this.songsService.getAllSongs();
  }
}
