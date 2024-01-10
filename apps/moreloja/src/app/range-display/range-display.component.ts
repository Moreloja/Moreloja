import { DatePipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  inject,
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
  @Input() range!: string;

  private rangeFilterCreatorWrapper = inject(RangeFilterCreatorWrapper);

  startDate(): Date | undefined {
    console.log(this.range);
    const rangeFilter = this.rangeFilterCreatorWrapper.constructRangeFilter(
      this.range,
    );
    return rangeFilter?.searchFrom;
  }

  endDate(): Date | undefined {
    console.log(this.range);
    const rangeFilter = this.rangeFilterCreatorWrapper.constructRangeFilter(
      this.range,
    );
    return rangeFilter?.searchTo;
  }
}
