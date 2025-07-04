import { Component, Input } from '@angular/core';

import { AlbumDto } from '@moreloja/api/data-access-dtos';

import { AlbumCardComponent } from '../album-card/album-card.component';

@Component({
  selector: 'moreloja-albums-container',
  imports: [AlbumCardComponent],
  templateUrl: './albums-container.component.html',
  styleUrls: ['./albums-container.component.css'],
})
export class AlbumsContainerComponent {
  @Input()
  albums!: AlbumDto[];
}
