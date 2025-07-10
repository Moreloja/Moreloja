import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

import { AlbumsService } from '@moreloja/services/albums';
import { GetAlbumResponseDto } from '@moreloja/api/data-access-dtos';

import { SongCardComponent } from '../song-card/song-card.component';
import { TopSongCardComponent } from '../top-song-card/top-song-card.component';
import { EditableImageComponent } from '../editable-image/editable-image.component';

@Component({
  selector: 'moreloja-album',
  imports: [
    AsyncPipe,
    RouterModule,
    EditableImageComponent,
    SongCardComponent,
    TopSongCardComponent,
  ],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlbumComponent implements OnInit {
  readonly mbidAlbum = input.required<string>();

  album$!: Observable<GetAlbumResponseDto>;

  private albumsService = inject(AlbumsService);

  ngOnInit(): void {
    this.album$ = this.albumsService.getAlbum(this.mbidAlbum());
  }
}
