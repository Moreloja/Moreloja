import { Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { ImageService } from '@moreloja/services/image';
import { PlaceholderAlbumCover } from '@moreloja/shared/global-constants';

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
    } else {
      if (this.viewModel.mbidArtist) {
        console.log('mbidArtist');
        this.coverUrl$ = this.imageService.getArtistPicture(
          this.viewModel.mbidArtist,
        );
      } else {
        // Neither album nor artist is set
        // Display a placeholder
        this.coverUrl$ = this.imageService.getAlbumCover(PlaceholderAlbumCover);
      }
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
