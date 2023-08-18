import { ArtistDto } from "./artist.dto";

export class GetArtistsResponseDto {
  constructor(public artists: ArtistDto[]) {}
}
