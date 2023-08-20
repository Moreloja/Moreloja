export class ArtistDto {
  constructor(
    public mbidArtist: string,
    public name: string,
    public playCount: number,
    public playTime: number
  ) {}
}
