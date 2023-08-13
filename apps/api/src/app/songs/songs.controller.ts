import { Controller, Get, Param } from '@nestjs/common';

import { SongsService } from '@moreloja/api/data-access-services';

@Controller()
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get('songs/artist/:mbidArtist/page/:page')
  getAllSongsByArtist(
    @Param('mbidArtist') mbidArtist: string,
    @Param('page') page: number
  ) {
    return this.songsService.getAllSongs(mbidArtist, page);
  }

  @Get('song/:mbidTrack/page/:page')
  getAllSongsByTrack(
    @Param('mbidTrack') mbidTrack: string,
    @Param('page') page: number
  ) {
    return this.songsService.getAllSongsByTrack(mbidTrack, page);
  }
}
