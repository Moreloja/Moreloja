import { Component, Input, OnInit } from '@angular/core';
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
export class SongCardComponent implements OnInit {
  
  @Input()
  song!: any;

  coverUrl!: string;

  ngOnInit(): void {
    this.coverUrl = `https://coverartarchive.org/release/${this.song.Provider_musicbrainzalbum}/front-250`;
  }
}
