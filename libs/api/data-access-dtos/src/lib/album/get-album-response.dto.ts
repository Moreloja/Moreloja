import { SongDto, TopSongDto } from '../songs';

export class GetAlbumResponseDto {
  constructor(
    public name: string,
    public artistName: string,
    public artistMbid: string,
    public topSongs: TopSongDto[],
    public songs: SongDto[],
  ) {}
}
