import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'moreloja-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongsComponent {}
