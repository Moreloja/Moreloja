import { AlbumDto } from '../artist';

export class GetAlbumsResponseDto {
  constructor(public albums: AlbumDto[]) {}
}
