import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DatePipe } from '@angular/common';

import { SecondsToStringPipe } from '../pipes/seconds-to-string.pipe';

export interface StatItem {
  label: string;
  value: string | number;
  pipe?: 'date' | 'secondsToString';
  pipeFormat?: string;
  valueType?: 'string' | 'number';
}

@Component({
  selector: 'moreloja-statistics-display',
  imports: [DatePipe, SecondsToStringPipe],
  templateUrl: './statistics-display.component.html',
  styleUrls: ['./statistics-display.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsDisplayComponent {
  readonly stats = input.required<StatItem[]>();
}
