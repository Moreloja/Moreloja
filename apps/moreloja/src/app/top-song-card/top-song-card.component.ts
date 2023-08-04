import { Component, Input, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TopSongDto } from '@moreloja/api/data-access-dtos';

@Component({
  selector: 'moreloja-top-song-card',
  standalone: true,
  imports: [NgFor, RouterModule],
  templateUrl: './top-song-card.component.html',
  styleUrls: ['./top-song-card.component.css'],
})
export class TopSongCardComponent implements OnInit {
  
  @Input()
  topSong!: TopSongDto;

  @Input()
  maxPlayCount!: number;

  coverUrl!: string;

  ngOnInit(): void {
    this.coverUrl = `https://coverartarchive.org/release/${this.topSong.Provider_musicbrainzalbum}/front-250`;
  }

  getPlayCountBarWidth(playCount: number): string {
    const percentage = (playCount / this.maxPlayCount) * 100;
    return percentage + '%';
  }
}
