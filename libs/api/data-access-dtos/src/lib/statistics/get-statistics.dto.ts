export class GetStatisticsDto {
  constructor(
    public TotalSongs: number | undefined,
    public TotalPlays: number | undefined,
    public TotalPlayTime: number | undefined,
    public TotalArtists: number | undefined,
    public TotalAlbums: number | undefined,
  ) {}
}
