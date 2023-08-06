import { Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, DatePipe, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { AlbumDto } from '@moreloja/api/data-access-dtos';
import { AlbumsService } from '@moreloja/services/albums';

@Component({
  selector: 'moreloja-album-card',
  standalone: true,
  imports: [AsyncPipe, DatePipe, NgIf, RouterModule],
  templateUrl: './album-card.component.html',
  styleUrls: ['./album-card.component.css'],
})
export class AlbumCardComponent implements OnInit {
  @Input()
  album!: AlbumDto;

  coverUrl$!: Observable<string>;

  private albumsService = inject(AlbumsService);

  ngOnInit(): void {
    this.coverUrl$ = this.albumsService.getAlbumCover(
      this.album.Provider_musicbrainzalbum
    );
  }
}
