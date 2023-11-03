export class WeeklyTopArtistsDto {
  constructor(
    public Year: number,
    public Week: number,
    public Artists: {
      Provider_musicbrainzartist: string;
      Artist: string;
      Plays: number;
    }[],
  ) {}
}
