import { Component, Input, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AlbumDto } from '@moreloja/api/data-access-dtos';

@Component({
  selector: 'moreloja-album-card',
  standalone: true,
  imports: [DatePipe, RouterModule],
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.css'],
})
export class AlbumCardComponent implements OnInit {
  
  @Input()
  album!: AlbumDto;

  coverUrl!: string;

  ngOnInit(): void {
    this.coverUrl = `https://coverartarchive.org/release/${this.album.Provider_musicbrainzalbum}/front-250`;
  }
}
