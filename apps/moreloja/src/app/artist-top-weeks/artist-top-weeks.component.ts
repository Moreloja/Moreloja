import { ChangeDetectionStrategy, Component, input } from '@angular/core';

import { RouterLink } from '@angular/router';

import { ArtistTopWeeksDto } from '@moreloja/api/data-access/dtos';

@Component({
  selector: 'moreloja-artist-top-weeks',
  imports: [RouterLink],
  templateUrl: './artist-top-weeks.component.html',
  styleUrls: ['./artist-top-weeks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistTopWeeksComponent {
  readonly artistTopWeeks = input.required<ArtistTopWeeksDto>();
}
