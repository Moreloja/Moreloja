import { AlbumDto } from './album.dto';
import { SongDto, TopSongDto } from '../songs';
import { ArtistTopWeeksDto } from './artist-top-weeks.dto';

export class GetArtistResponse {
  constructor(
    public name: string,
    public artistTopWeeks: ArtistTopWeeksDto,
    public albums: AlbumDto[],
    public appearsOnAlbums: AlbumDto[],
    public topSongs: TopSongDto[],
    public songs: SongDto[],
  ) {}
}
