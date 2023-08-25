import { AlbumDto } from './album.dto';
import { SongDto, TopSongDto } from '../songs';

export class GetArtistResponse {
  constructor(
    public name: string,
    public albums: AlbumDto[],
    public appearsOnAlbums: AlbumDto[],
    public topSongs: TopSongDto[],
    public songs: SongDto[]
  ) {}
}
