import { Injectable } from '@nestjs/common';

import { RangeFilterCreator } from '@moreloja/shared/utils';

@Injectable()
export class RangeFilterCreatorWrapper {
  constructRangeFilter(range: string):
    | {
        searchFrom: Date;
        searchTo: Date;
      }
    | undefined {
    const creator = new RangeFilterCreator();
    return creator.constructRangeFilter(range);
  }
}
