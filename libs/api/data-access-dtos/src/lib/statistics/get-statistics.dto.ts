export class GetStatisticsDto {
  constructor(
    public TotalSongs: number,
    public TotalPlays: number,
    public TotalPlayTime: number,
    public TotalArtists: number,
    public TotalAlbums: number,
  ) {}
}
