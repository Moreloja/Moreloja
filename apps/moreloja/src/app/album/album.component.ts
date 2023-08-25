import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

import { AlbumsService } from '@moreloja/services/albums';
import { ImageService } from '@moreloja/services/image';
import { GetAlbumResponseDto } from '@moreloja/api/data-access-dtos';

import { SongCardComponent } from '../song-card/song-card.component';
import { TopSongCardComponent } from '../top-song-card/top-song-card.component';

@Component({
  selector: 'moreloja-album',
  standalone: true,
  imports: [
    AsyncPipe,
    JsonPipe,
    NgFor,
    NgIf,
    SongCardComponent,
    TopSongCardComponent,
  ],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlbumComponent implements OnInit {
  private mbidAlbum!: string;

  album$!: Observable<GetAlbumResponseDto>;
  coverUrl$!: Observable<string>;

  @Input()
  set mbidAlbumInput(mbidAlbum: string) {
    this.mbidAlbum = mbidAlbum;
  }
  get mbidAlbumInput(): string {
    return this.mbidAlbum;
  }

  private albumsService = inject(AlbumsService);
  private imageService = inject(ImageService);

  ngOnInit(): void {
    this.album$ = this.albumsService.getAlbum(this.mbidAlbum);
    this.coverUrl$ = this.imageService.getAlbumCover(this.mbidAlbum);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFiles = input.files;

    if (selectedFiles && selectedFiles.length > 0) {
      this.imageService.setImage(this.mbidAlbum, selectedFiles[0]);
    }
  }
}
