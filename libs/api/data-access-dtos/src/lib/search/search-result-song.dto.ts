export class SearchResultSongDto {
  constructor(
    public Song: string,
    public Provider_musicbrainzalbum: string,
    public Provider_musicbrainztrack: string,
  ) {}
}
