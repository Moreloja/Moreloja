import { Controller, Get, Param } from '@nestjs/common';

import { SearchService } from '@moreloja/api/data-access-services';
import { SearchResultDto } from '@moreloja/api/data-access-dtos';

@Controller()
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('search/:search')
  getArtist(@Param('search') search: string): Promise<SearchResultDto> {
    return this.searchService.find(search);
  }
}
