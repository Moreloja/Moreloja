import { Injectable } from '@nestjs/common';

import { SongRepository } from '@moreloja/api/data-access-repositories';

@Injectable()
export class DatabaseStructureService {
  constructor(private readonly songRepository: SongRepository) {}

  async ensureDatabaseStructureIsCorrect(): Promise<void> {
    await this.songRepository.ensureDatabaseStructureIsCorrect();
  }
}
