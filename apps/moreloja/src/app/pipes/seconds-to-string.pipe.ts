import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'secondsToString',
  standalone: true,
})
export class SecondsToStringPipe implements PipeTransform {
  public transform(totalSeconds: number): string {
    const hours = Math.floor(totalSeconds / 3600);
    const remainingSeconds = totalSeconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;

    // Adding leading zeroes using padStart
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
  }
}
