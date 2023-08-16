import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {

  readonly songsPerPage = 25;

  pagesToSkip(page: number): number {
    const result = (page - 1) * this.songsPerPage;
    return result < 0 ? 0 : result;
  }
}
