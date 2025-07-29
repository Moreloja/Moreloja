import { Controller, Get, Param } from '@nestjs/common';

import { SongsService } from '@moreloja/api/data-access/services';
import { GetTopSongsResponseDto } from '@moreloja/api/data-access/dtos';

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

  @Get('songs/artist/:mbidArtist/total-pages')
  async getTotalPagesByArtist(
    @Param('mbidArtist') mbidArtist: string,
  ): Promise<number> {
    return this.songsService.getTotalPagesByArtist(mbidArtist);
  }

  @Get('song/:mbidTrack/total-pages')
  async getTotalPagesByTrack(
    @Param('mbidTrack') mbidTrack: string,
  ): Promise<number> {
    return this.songsService.getTotalPagesByTrack(mbidTrack);
  }

  @Get('top-songs/:range/total-pages')
  async getTotalPagesForTopSongs(
    @Param('range') range: string,
  ): Promise<number> {
    return this.songsService.getTotalPagesForTopSongs(range);
  }
}
