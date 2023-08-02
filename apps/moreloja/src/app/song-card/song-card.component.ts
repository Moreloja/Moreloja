import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'moreloja-song-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.css'],
})
export class SongCardComponent {

  @Input()
  song!: any

}
