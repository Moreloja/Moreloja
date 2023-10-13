import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { RouterModule } from '@angular/router';

import { AlbumsService } from '@moreloja/services/albums';
import { GetAlbumResponseDto } from '@moreloja/api/data-access-dtos';

import { SongCardComponent } from '../song-card/song-card.component';
import { TopSongCardComponent } from '../top-song-card/top-song-card.component';
import { EditableImageComponent } from '../editable-image/editable-image.component';

@Component({
  selector: 'moreloja-album',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NgFor,
    NgIf,
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
  @Input()
  mbidAlbum!: string;

  album$!: Observable<GetAlbumResponseDto>;

  private albumsService = inject(AlbumsService);

  ngOnInit(): void {
    this.album$ = this.albumsService.getAlbum(this.mbidAlbum);
  }
}
