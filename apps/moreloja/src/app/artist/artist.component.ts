import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Observable } from 'rxjs';

import { GetArtistResponseDto } from '@moreloja/api/data-access-dtos';
import { ArtistsService } from '@moreloja/services/artists';

import { AlbumCardComponent } from '../album-card/album-card.component';
import { SongCardComponent } from '../song-card/song-card.component';
import { TopSongCardComponent } from '../top-song-card/top-song-card.component';

@Component({
  selector: 'moreloja-artist',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    AlbumCardComponent,
    SongCardComponent,
    TopSongCardComponent,
    RouterLink,
  ],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistComponent implements OnInit {
  private mbidAlbumArtist!: string;

  artist$!: Observable<GetArtistResponseDto>;

  @Input()
  set mbidAlbumArtistInput(mbidAlbumArtist: string) {
    this.mbidAlbumArtist = mbidAlbumArtist;
  }
  get mbidAlbumArtistInput(): string {
    return this.mbidAlbumArtist;
  }

  private artistsService = inject(ArtistsService);

  ngOnInit(): void {
    this.artist$ = this.artistsService.getArtist(this.mbidAlbumArtist);
  }
}
