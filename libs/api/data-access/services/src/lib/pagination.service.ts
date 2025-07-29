import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  readonly itemsPerPage = 25;

  pagesToSkip(page: number): number {
    const result = (page - 1) * this.itemsPerPage;
    return result < 0 ? 0 : result;
  }
}
