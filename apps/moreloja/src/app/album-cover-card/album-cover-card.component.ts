import { Component, Input, OnInit, inject } from '@angular/core';
import { AsyncPipe, NgIf, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Observable } from 'rxjs';

import { AlbumsService } from '@moreloja/services/albums';

@Component({
  selector: 'moreloja-album-cover-card',
  standalone: true,
  imports: [AsyncPipe, SlicePipe, NgIf, RouterModule],
  templateUrl: './album-cover-card.component.html',
  styleUrls: ['./album-cover-card.component.css'],
})
export class AlbumCoverCardComponent implements OnInit {
  @Input()
  album!: {
    Provider_musicbrainzalbum: string;
    Album: string;
  };

  @Input()
  size!: number;

  coverUrl$!: Observable<string>;

  private albumsService = inject(AlbumsService);

  ngOnInit(): void {
    this.coverUrl$ = this.albumsService.getAlbumCover(
      this.album.Provider_musicbrainzalbum
    );
  }
}
