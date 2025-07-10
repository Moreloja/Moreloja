import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
  input,
  Signal,
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

import { AuthService } from '@moreloja/services/authentication';
import { ImageService } from '@moreloja/services/image';

@Component({
  selector: 'moreloja-editable-image',
  imports: [AsyncPipe],
  templateUrl: './editable-image.component.html',
  styleUrls: ['./editable-image.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditableImageComponent implements OnInit {
  readonly mbidAlbum = input<string>();
  readonly mbidArtist = input<string>();
  readonly size = input(250);

  private authService = inject(AuthService);
  private imageService = inject(ImageService);

  url$!: Observable<string>;
  error$!: Observable<string>;
  isLoggedIn = this.authService.isLoggedIn();

  ngOnInit(): void {
    const mbidAlbum = this.mbidAlbum();
    if (mbidAlbum) {
      this.url$ = this.imageService.getAlbumCover(mbidAlbum);
    }
    const mbidArtist = this.mbidArtist();
    if (mbidArtist) {
      this.url$ = this.imageService.getArtistPicture(mbidArtist);
    }
    this.error$ = this.imageService.getError();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const selectedFiles = input.files;

    if (selectedFiles && selectedFiles.length > 0) {
      const mbidAlbum = this.mbidAlbum();
      if (mbidAlbum) {
        this.imageService.setImage(mbidAlbum, selectedFiles[0]);
      }
      const mbidArtist = this.mbidArtist();
      if (mbidArtist) {
        this.imageService.setImage(mbidArtist, selectedFiles[0]);
      }
    }
  }
}
