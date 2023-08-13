import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

import { AlbumsService } from '@moreloja/services/albums';
import { AlbumDto } from '@moreloja/api/data-access-dtos';

import { AlbumsContainerComponent } from '../albums-container/albums-container.component';

@Component({
  selector: 'moreloja-albums',
  standalone: true,
  imports: [AsyncPipe, NgIf, AlbumsContainerComponent],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlbumsComponent implements OnInit {
  
  albums$!: Observable<AlbumDto[]>;

  albumsService = inject(AlbumsService);

  ngOnInit(): void {
    this.albums$ = this.albumsService.getAlbums();
  }
}
