import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { SongsService } from '@moreloja/services/songs';


@Component({
  selector: 'moreloja-songs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SongsComponent implements OnInit {
  songs$!: Observable<any>
  
  constructor(private songsService: SongsService) {  }

  ngOnInit(): void {
    console.log("loading songs");
    this.songs$ = this.songsService.getAllSongs()
  }
}
