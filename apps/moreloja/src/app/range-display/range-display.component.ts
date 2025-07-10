import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';

import { RangeFilterCreatorWrapper } from './range-filter-creator.wrapper';

@Component({
  selector: 'moreloja-range-display',
  imports: [DatePipe],
  templateUrl: './range-display.component.html',
  styleUrls: ['./range-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeDisplayComponent {
  readonly range = input.required<string>();

  private rangeFilterCreatorWrapper = inject(RangeFilterCreatorWrapper);

  startDate(): Date | undefined {
    const range = this.range();
    console.log(range);
    const rangeFilter =
      this.rangeFilterCreatorWrapper.constructRangeFilter(range);
    return rangeFilter?.searchFrom;
  }

  endDate(): Date | undefined {
    const range = this.range();
    console.log(range);
    const rangeFilter =
      this.rangeFilterCreatorWrapper.constructRangeFilter(range);
    return rangeFilter?.searchTo;
  }
}
