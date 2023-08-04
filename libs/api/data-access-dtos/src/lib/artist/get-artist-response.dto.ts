import { SongDto } from '../songs';

export class GetArtistResponseDto {
  constructor(
    public name: string,
    public albums: any, // TODO
    public songs: SongDto[]
  ) {}
}
