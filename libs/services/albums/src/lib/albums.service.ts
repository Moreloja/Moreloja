import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { GetImageResponseDto } from '@moreloja/api/data-access-dtos';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {
  private http = inject(HttpClient);

  getAlbumCover(musicbrainzalbum: string): Observable<string> {
    return this.http
      .get<GetImageResponseDto>(`/api/image/album/${musicbrainzalbum}`)
      .pipe(map((response) => response.image_url));
  }
}
