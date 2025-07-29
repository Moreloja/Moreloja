export class SearchResultAlbumDto {
  constructor(
    public Album: string,
    public Provider_musicbrainzalbum: string,
    public Year: number,
  ) {}
}
