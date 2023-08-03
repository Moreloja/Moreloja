import { Controller, Get } from '@nestjs/common';

import { SongsService } from './songs.service';

@Controller()
export class AppController {
  constructor(private readonly songsService: SongsService) {}

  @Get('songs')
  getData() {
    return this.songsService.getAllSongs();
  }
}
