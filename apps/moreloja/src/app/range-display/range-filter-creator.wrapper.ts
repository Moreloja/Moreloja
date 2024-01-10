import { Injectable } from '@angular/core';

import { RangeFilterCreator } from '@moreloja/shared/utils';

@Injectable({
  providedIn: 'root',
})
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
