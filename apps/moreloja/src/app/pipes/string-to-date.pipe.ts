import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stringToDate',
  standalone: true,
})
export class StringToDatePipe implements PipeTransform {

  public transform(inputString: string): Date {
    return new Date(inputString);
  }
}
