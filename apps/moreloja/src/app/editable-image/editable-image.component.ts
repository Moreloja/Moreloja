import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

import { AuthService } from '@moreloja/services/authentication';
import { ImageService } from '@moreloja/services/image';

import { SongCardComponent } from '../song-card/song-card.component';
import { TopSongCardComponent } from '../top-song-card/top-song-card.component';

@Component({
  selector: 'moreloja-editable-image',
  standalone: true,
  imports: [AsyncPipe, NgIf, SongCardComponent, TopSongCardComponent],
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableImageComponent implements OnInit {
  @Input()
  mbidAlbum?: string;

  @Input()
  mbidArtist?: string;

  @Input()
  size = 250;

  url$!: Observable<string>;
  error$!: Observable<string>;
  isLoggedIn$!: Observable<boolean>;

  private authService = inject(AuthService);
  private imageService = inject(ImageService);

  ngOnInit(): void {
    if (this.mbidAlbum) {
      this.url$ = this.imageService.getAlbumCover(this.mbidAlbum);
    }
    if (this.mbidArtist) {
      this.url$ = this.imageService.getArtistPicture(this.mbidArtist);
    }
    this.error$ = this.imageService.getError();
    this.isLoggedIn$ = this.authService.isLoggedIn();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFiles = input.files;

    if (selectedFiles && selectedFiles.length > 0) {
      if (this.mbidAlbum) {
        this.imageService.setImage(this.mbidAlbum, selectedFiles[0]);
      }
      if (this.mbidArtist) {
        this.imageService.setImage(this.mbidArtist, selectedFiles[0]);
      }
    }
  }
}
