import { Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { ImageService } from '@moreloja/services/image';

export type AlbumCoverCardViewModel = {
  mbidAlbum?: string;
  name: string;
  mbidArtist?: string;
  mbidTrack?: string;
};

@Component({
  selector: 'moreloja-album-cover-card',
  standalone: true,
  imports: [AsyncPipe, SlicePipe, NgIf, RouterModule],
  templateUrl: './album-cover-card.component.html',
  styleUrls: ['./album-cover-card.component.css'],
})
export class AlbumCoverCardComponent implements OnInit {
  @Input()
  viewModel!: AlbumCoverCardViewModel;

  @Input()
  size!: number;

  @Input()
  linkToAlbum = false;

  coverUrl$!: Observable<string>;

  private imageService = inject(ImageService);

  ngOnInit(): void {
    if (this.viewModel.mbidAlbum) {
      console.log('mbidAlbum');
      this.coverUrl$ = this.imageService.getAlbumCover(
        this.viewModel.mbidAlbum,
      );
    }
    if (this.viewModel.mbidArtist) {
      console.log('mbidArtist');
      this.coverUrl$ = this.imageService.getArtistPicture(
        this.viewModel.mbidArtist,
      );
    }
  }

  getLink(): string {
    if (this.viewModel.mbidTrack && !this.linkToAlbum) {
      return `/song/${this.viewModel.mbidTrack}/page/1`;
    }
    if (this.viewModel.mbidArtist) {
      return `/artist/${this.viewModel.mbidArtist}`;
    }
    return `/album/${this.viewModel.mbidAlbum}`;
  }
}
