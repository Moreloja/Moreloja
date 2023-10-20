import { Injectable } from '@nestjs/common';

import { SongRepository } from '@moreloja/api/data-access-repositories';
import { SearchResultDto } from '@moreloja/api/data-access-dtos';

@Injectable()
export class SearchService {
  constructor(private songRepository: SongRepository) {}

  async find(search: string): Promise<SearchResultDto> {
    return await this.songRepository.searchAll(search);
  }
}
