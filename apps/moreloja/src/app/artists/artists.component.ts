import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'moreloja-artists',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArtistsComponent {}
