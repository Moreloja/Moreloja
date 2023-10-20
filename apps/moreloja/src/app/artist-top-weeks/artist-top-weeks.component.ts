import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ArtistTopWeeksDto } from '@moreloja/api/data-access-dtos';

@Component({
  selector: 'moreloja-artist-top-weeks',
  standalone: true,
  imports: [NgFor, RouterLink],
  templateUrl: './artist-top-weeks.component.html',
  styleUrls: ['./artist-top-weeks.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistTopWeeksComponent {
  @Input()
  artistTopWeeks!: ArtistTopWeeksDto;
}
