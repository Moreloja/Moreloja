import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { format, startOfWeek } from 'date-fns';

import { Order, Range, Sort } from '@moreloja/shared/global-constants';

@Component({
  selector: 'moreloja-range-selection',
  standalone: true,
  imports: [NgIf, NgFor, RouterModule],
  templateUrl: './range-selection.component.html',
  styleUrls: ['./range-selection.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RangeSelectionComponent {
  ranges: { label: string; range: string }[] = [
    { label: 'Today', range: format(new Date(), 'yyyy-MM-dd') },
    {
      label: 'This Week',
      range: `${format(new Date(), 'yyyy')}-W${format(
        startOfWeek(new Date(), { weekStartsOn: 1 }),
        'II'
      )}`,
    },
    { label: 'This Month', range: format(new Date(), 'yyyy-MM') },
    { label: 'This Year', range: format(new Date(), 'yyyy') },
    { label: 'All Time', range: Range.All },
  ];

  @Input() pagePath!: string;
  @Input() sortBy?: Sort;
  @Input() order?: Order;
}
