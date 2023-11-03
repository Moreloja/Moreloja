import { Controller, Get, Param } from '@nestjs/common';

import { SongsService } from '@moreloja/api/data-access-services';
import { GetTopSongsResponseDto } from '@moreloja/api/data-access-dtos';

@Controller()
export class SongsController {
  constructor(private readonly songsService: SongsService) {}

  @Get('songs/artist/:mbidArtist/page/:page')
  getAllSongsByArtist(
    @Param('mbidArtist') mbidArtist: string,
    @Param('page') page: number,
  ) {
    return this.songsService.getAllSongs(mbidArtist, page);
  }

  @Get('top-songs/:range/page/:page')
  getTopSongs(
    @Param('range') range: string,
    @Param('page') page: number,
  ): Promise<GetTopSongsResponseDto> {
    return this.songsService.getTopSongs(range, page);
  }

  @Get('song/:mbidTrack/page/:page')
  getAllSongsByTrack(
    @Param('mbidTrack') mbidTrack: string,
    @Param('page') page: number,
  ) {
    return this.songsService.getAllSongsByTrack(mbidTrack, page);
  }
}
