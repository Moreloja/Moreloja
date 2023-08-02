import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'moreloja-song',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongComponent {}
