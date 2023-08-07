export class SongDto {
  constructor(
    public Album: string,
    public Artist: string,
    public Name: string,
    public timestamp: string,
    public Provider_musicbrainzalbum: string,
    public Provider_musicbrainzalbumartist: string,
    public Provider_musicbrainztrack: string,
    public run_time: number
  ) {}
}
