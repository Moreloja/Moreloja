import { ArtistDto } from './artist.dto';

export class GetArtistsResponse {
  constructor(public artists: ArtistDto[]) {}
}
