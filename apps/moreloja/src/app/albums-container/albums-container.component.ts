import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

import { AlbumDto } from '@moreloja/api/data-access-dtos';

import { AlbumCardComponent } from '../album-card/album-card.component';

@Component({
  selector: 'moreloja-albums-container',
  standalone: true,
  imports: [AlbumCardComponent, NgFor],
  templateUrl: './albums-container.component.html',
  styleUrls: ['./albums-container.component.css'],
})
export class AlbumsContainerComponent {
  @Input()
  albums!: AlbumDto[];
}
