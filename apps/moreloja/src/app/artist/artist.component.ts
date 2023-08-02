import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'moreloja-artist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistComponent {}
