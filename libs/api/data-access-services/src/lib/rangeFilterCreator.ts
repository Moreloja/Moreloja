import { Injectable } from '@nestjs/common';

import { Range } from '@moreloja/shared/global-constants';

@Injectable()
export class RangeFilterCreator {
  constructRangeFilter(range: string):
    | {
        searchFrom: Date;
        searchTo: Date;
      }
    | undefined {
    if (range === Range.All) {
      return undefined;
    }

    // Check if range contains string "W"
    if (range.includes('W')) {
      const year = range.replace('-', '').split('W')[0];
      const week = range.replace('-', '').split('W')[1];

      const weekStartDate = this.getFirstDateOfWeek(
        parseInt(year),
        parseInt(week),
      );
      const weekEndDate = new Date(weekStartDate);
      weekEndDate.setDate(weekEndDate.getDate() + 7);
      weekEndDate.setHours(23, 59, 59);

      return {
        searchFrom: weekStartDate,
        searchTo: weekEndDate,
      };
    } else {
      const parts = range.split('-');
      const partsCount = parts.length;

      if (partsCount === 1) {
        const year = parts[0];
        return {
          searchFrom: new Date(parseInt(year), 0, 1),
          searchTo: new Date(parseInt(year), 11, 31, 23, 59, 59),
        };
      } else if (partsCount === 2) {
        const year = parts[0];
        const month = parts[1];
        return {
          searchFrom: new Date(parseInt(year), parseInt(month) - 1, 1),
          searchTo: new Date(
            parseInt(year),
            parseInt(month) - 1,
            31,
            23,
            59,
            59,
          ),
        };
      } else if (partsCount === 3) {
        const year = parts[0];
        const month = parts[1];
        const day = parts[2];
        return {
          searchFrom: new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
          ),
          searchTo: new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            23,
            59,
            59,
          ),
        };
      }
    }

    throw 'Invalid range';
  }

  private getFirstDateOfWeek(year: number, week: number): Date {
    // Assuming the week starts on Monday (ISO week date standard)
    const januaryFourth = new Date(year, 0, 4);
    const daysToAdd = (week - 1) * 7;
    const firstWeekDay = januaryFourth.getDay(); // 0-based index, 0 for Sunday, 1 for Monday, etc.

    // Calculate the starting date of the given week
    const startDate = new Date(year, 0, 4 + (1 - firstWeekDay) + daysToAdd);

    return startDate;
  }
}
