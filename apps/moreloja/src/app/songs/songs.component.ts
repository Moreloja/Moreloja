import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

import { SongsService } from '@moreloja/services/songs';
import { GetAllSongsResponseDto } from '@moreloja/api/data-access-dtos';

import { SongCardComponent } from '../song-card/song-card.component';

@Component({
  selector: 'moreloja-songs',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, SongCardComponent],
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SongsComponent implements OnInit {
  songs$!: Observable<GetAllSongsResponseDto>;

  private songsService = inject(SongsService);

  ngOnInit(): void {
    this.songs$ = this.songsService.getAllSongs();
  }
}
