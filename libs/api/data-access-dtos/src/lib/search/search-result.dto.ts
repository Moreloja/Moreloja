import { SearchResultAlbumDto } from './search-result-album.dto';
import { SearchResultArtistDto } from './search-result-artist.dto';
import { SearchResultSongDto } from './search-result-song.dto';

export class SearchResultDto {
  constructor(
    public Albums: SearchResultAlbumDto[],
    public Artists: SearchResultArtistDto[],
    public Songs: SearchResultSongDto[],
  ) {}
}
