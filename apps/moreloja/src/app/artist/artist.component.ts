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

import { GetArtistResponse } from '@moreloja/api/data-access-dtos';
import { ArtistsService } from '@moreloja/services/artists';

import { AlbumCardComponent } from '../album-card/album-card.component';
import { SongCardComponent } from '../song-card/song-card.component';
import { TopSongCardComponent } from '../top-song-card/top-song-card.component';
import { EditableImageComponent } from '../editable-image/editable-image.component';

@Component({
  selector: 'moreloja-artist',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    AlbumCardComponent,
    EditableImageComponent,
    SongCardComponent,
    TopSongCardComponent,
    RouterLink,
  ],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistComponent implements OnInit {
  @Input()
  mbidAlbumArtist!: string;

  artist$!: Observable<GetArtistResponse>;

  private artistsService = inject(ArtistsService);

  ngOnInit(): void {
    this.artist$ = this.artistsService.getArtist(this.mbidAlbumArtist);
  }
}
