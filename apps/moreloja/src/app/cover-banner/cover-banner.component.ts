import { Component, Input } from '@angular/core';
import { NgFor, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  AlbumCoverCardComponent,
  AlbumCoverCardViewModel,
} from '../album-cover-card/album-cover-card.component';

@Component({
  selector: 'moreloja-cover-banner',
  standalone: true,
  imports: [SlicePipe, AlbumCoverCardComponent, NgFor, RouterModule],
  templateUrl: './cover-banner.component.html',
  styleUrls: ['./cover-banner.component.css'],
})
export class CoverBannerComponent {
  _viewModels!: AlbumCoverCardViewModel[];

  @Input()
  set viewModels(viewModels: AlbumCoverCardViewModel[]) {
    console.log('banner at input');
    this._viewModels = viewModels;
  }
  get viewModels() {
    return this._viewModels;
  }
}
