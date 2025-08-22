import { Injectable } from '@nestjs/common';

import { GetStatisticsDto } from '@moreloja/api/data-access/dtos';
import { SongRepository } from '@moreloja/api/data-access/repositories';

@Injectable()
export class StatisticsService {
  constructor(private songRepository: SongRepository) {}

  async getStatistics(): Promise<GetStatisticsDto> {
    const noFilter = {};

    const [
      { uniqueSongsCount },
      { totalPlayCount },
      { totalPlayTime },
      { uniqueArtistsCount },
      { uniqueAlbumsCount },
      { averageDuration },
    ] = await Promise.all([
      this.songRepository.getUniqueSongsCount(noFilter),
      this.songRepository.getTotalPlayCount(noFilter),
      this.songRepository.getTotalPlayTime(noFilter),
      this.songRepository.getUniqueArtistsCount(),
      this.songRepository.getUniqueAlbumsCount(),
      this.songRepository.getAverageSongDuration(),
    ]);

    return {
      TotalSongs: uniqueSongsCount,
      TotalPlays: totalPlayCount,
      TotalPlayTime: totalPlayTime,
      TotalArtists: uniqueArtistsCount,
      TotalAlbums: uniqueAlbumsCount,
      AverageSongDuration: averageDuration,
    };
  }
}
