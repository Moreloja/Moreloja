import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgFor } from '@angular/common';
import { Observable } from 'rxjs';

import { SongsService } from '@moreloja/services/songs';

import { SongCardComponent } from '../song-card/song-card.component';


@Component({
  selector: 'moreloja-songs',
  standalone: true,
  imports: [AsyncPipe, NgFor, SongCardComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SongsComponent implements OnInit {
  songs$!: Observable<any>
  
  private songsService = inject(SongsService);

  ngOnInit(): void {
    console.log("loading songs");
    this.songs$ = this.songsService.getAllSongs()
  }
}
