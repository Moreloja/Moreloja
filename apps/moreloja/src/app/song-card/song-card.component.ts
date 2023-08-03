import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { StringToDatePipe, TimeAgoPipe } from '../pipes';

@Component({
  selector: 'moreloja-song-card',
  standalone: true,
  imports: [CommonModule, RouterModule, StringToDatePipe, TimeAgoPipe],
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.css'],
})
export class SongCardComponent {
  @Input()
  song!: any;
}
