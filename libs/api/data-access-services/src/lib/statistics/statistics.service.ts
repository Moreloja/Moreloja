import { Injectable } from '@nestjs/common';

import { GetStatisticsDto } from '@moreloja/api/data-access-dtos';
import { SongRepository } from '@moreloja/api/data-access-repositories';

@Injectable()
export class StatisticsService {
  constructor(private songRepository: SongRepository) {}

  async getStatistics(): Promise<GetStatisticsDto> {
    const { uniqueSongsCount } =
      await this.songRepository.getUniqueSongsCount();

    const { totalPlayCount } = await this.songRepository.getTotalPlayCount();

    const { totalPlayTime } = await this.songRepository.getTotalPlayTime();

    const { uniqueArtistsCount } =
      await this.songRepository.getUniqueArtistsCount();

    const { uniqueAlbumsCount } =
      await this.songRepository.getUniqueAlbumsCount();

    return {
      TotalSongs: uniqueSongsCount,
      TotalPlays: totalPlayCount,
      TotalPlayTime: totalPlayTime,
      TotalArtists: uniqueArtistsCount,
      TotalAlbums: uniqueAlbumsCount,
    };
  }
}
