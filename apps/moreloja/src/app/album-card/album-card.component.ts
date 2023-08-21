import { Component, Input } from '@angular/core';
import { AsyncPipe, NgIf, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AlbumDto } from '@moreloja/api/data-access-dtos';

import { AlbumCoverCardComponent } from '../album-cover-card/album-cover-card.component';

@Component({
  selector: 'moreloja-album-card',
  standalone: true,
  imports: [AsyncPipe, SlicePipe, NgIf, AlbumCoverCardComponent, RouterModule],
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.css'],
})
export class AlbumCardComponent {
  @Input()
  album!: AlbumDto;
}
