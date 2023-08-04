import { AlbumDto } from './album.dto';
import { SongDto, TopSongDto } from '../songs';

export class GetArtistResponseDto {
  constructor(
    public name: string,
    public albums: AlbumDto[],
    public topSongs: TopSongDto[],
    public songs: SongDto[]
  ) {}
}
