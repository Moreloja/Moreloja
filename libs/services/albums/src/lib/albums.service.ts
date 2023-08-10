import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  GetAlbumResponseDto,
  GetImageResponseDto,
} from '@moreloja/api/data-access-dtos';
import { Observable, map, merge, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {
  private http = inject(HttpClient);

  getAlbum(mbidAlbum: string): Observable<GetAlbumResponseDto> {
    return this.http.get<GetAlbumResponseDto>(`/api/album/${mbidAlbum}`);
  }

  getAlbumCover(musicbrainzalbum: string): Observable<string> {
    return merge(
      // TODO Use static image instead
      of('2d8649a6-96ff-48d5-a133-36da61261edd.webp'),
      this.http
        .get<GetImageResponseDto>(`/api/image/album/${musicbrainzalbum}`)
        .pipe(map((response) => response.image_url))
    );
  }

  setAlbumCover(musicbrainzalbum: string, image: File): Observable<string> {
    const formData = new FormData();
    formData.append('image', image);
    return this.http
      .post<GetImageResponseDto>(
        `/api/image/album/${musicbrainzalbum}`,
        formData
      )
      .pipe(map((response) => response.image_url));
  }
}
