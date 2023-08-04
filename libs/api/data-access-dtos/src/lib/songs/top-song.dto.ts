export class TopSongDto {
  constructor(
    public Album: string,
    public Name: string,
    public Provider_musicbrainzalbum: string,
    public Provider_musicbrainztrack: string,
    public run_time: number,
    public playCount: number,
  ) {}
}
