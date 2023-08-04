import { AlbumDto } from './album.dto';
import { SongDto } from '../songs';

export class GetArtistResponseDto {
  constructor(
    public name: string,
    public albums: AlbumDto[],
    public songs: SongDto[]
  ) {}
}
