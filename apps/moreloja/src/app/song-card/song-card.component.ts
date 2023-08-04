import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { SongDto } from '@moreloja/api/data-access-dtos';

import { StringToDatePipe, TimeAgoPipe } from '../pipes';

@Component({
  selector: 'moreloja-song-card',
  standalone: true,
  imports: [DatePipe, RouterModule, StringToDatePipe, TimeAgoPipe],
  templateUrl: './song-card.component.html',
  styleUrls: ['./song-card.component.css'],
})
export class SongCardComponent implements OnInit {
  
  @Input()
  song!: SongDto;

  coverUrl!: string;

  ngOnInit(): void {
    this.coverUrl = `https://coverartarchive.org/release/${this.song.Provider_musicbrainzalbum}/front-250`;
  }
}
