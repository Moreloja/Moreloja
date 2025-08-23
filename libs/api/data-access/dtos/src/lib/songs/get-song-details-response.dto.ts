import { SongDto } from './song.dto';

export class GetSongDetailsResponseDto {
  constructor(
    public songName: string,
    public playCount: number,
    public firstListenDate: string,
    public lastListenDate: string,
    public songs: SongDto[],
  ) {}
}
