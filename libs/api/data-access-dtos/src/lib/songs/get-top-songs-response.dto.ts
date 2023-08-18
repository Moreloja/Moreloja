import { TopSongDto } from './top-song.dto';

export class GetTopSongsResponseDto {
  constructor(public topSongs: TopSongDto[]) {}
}
