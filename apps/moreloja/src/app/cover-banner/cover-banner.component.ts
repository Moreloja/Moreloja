import { Component, input } from '@angular/core';
import { SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  AlbumCoverCardComponent,
  AlbumCoverCardViewModel,
} from '../album-cover-card/album-cover-card.component';

@Component({
  selector: 'moreloja-cover-banner',
  imports: [SlicePipe, AlbumCoverCardComponent, RouterModule],
  templateUrl: './cover-banner.component.html',
  styleUrls: ['./cover-banner.component.css'],
})
export class CoverBannerComponent {
  readonly viewModels = input.required<AlbumCoverCardViewModel[]>();
}
