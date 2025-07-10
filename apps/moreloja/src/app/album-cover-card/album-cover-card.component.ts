import { Component, OnInit, inject, input } from '@angular/core';
import { AsyncPipe } from '@angular/common';
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
  imports: [AsyncPipe, RouterModule],
  templateUrl: './album-cover-card.component.html',
  styleUrls: ['./album-cover-card.component.css'],
})
export class AlbumCoverCardComponent implements OnInit {
  readonly viewModel = input.required<AlbumCoverCardViewModel>();

  readonly size = input.required<number>();

  readonly linkToAlbum = input(false);

  coverUrl$!: Observable<string>;

  private imageService = inject(ImageService);

  ngOnInit(): void {
    const viewModel = this.viewModel();
    if (viewModel.mbidAlbum) {
      console.log('mbidAlbum');
      this.coverUrl$ = this.imageService.getAlbumCover(viewModel.mbidAlbum);
    } else {
      if (viewModel.mbidArtist) {
        console.log('mbidArtist');
        this.coverUrl$ = this.imageService.getArtistPicture(
          viewModel.mbidArtist,
        );
      } else {
        // Neither album nor artist is set
        // Display a placeholder
        this.coverUrl$ = this.imageService.getAlbumCover(PlaceholderAlbumCover);
      }
    }
  }

  getLink(): string {
    const viewModel = this.viewModel();
    if (viewModel.mbidTrack && !this.linkToAlbum()) {
      return `/song/${viewModel.mbidTrack}/page/1`;
    }
    if (viewModel.mbidArtist) {
      return `/artist/${viewModel.mbidArtist}`;
    }
    return `/album/${viewModel.mbidAlbum}`;
  }
}
