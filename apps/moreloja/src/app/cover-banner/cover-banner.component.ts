import { Component, Input } from '@angular/core';
import { NgFor, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { TopSongDto } from '@moreloja/api/data-access-dtos';

import { AlbumCoverCardComponent } from '../album-cover-card/album-cover-card.component';

@Component({
  selector: 'moreloja-cover-banner',
  standalone: true,
  imports: [SlicePipe, AlbumCoverCardComponent, NgFor, RouterModule],
  templateUrl: './cover-banner.component.html',
  styleUrls: ['./cover-banner.component.css'],
})
export class CoverBannerComponent {
  @Input()
  items!: TopSongDto[];
}
