import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  AlbumDto,
  GetAlbumResponseDto,
  GetAlbumsResponseDto,
} from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {
  private http = inject(HttpClient);

  getAlbum(mbidAlbum: string): Observable<GetAlbumResponseDto> {
    return this.http.get<GetAlbumResponseDto>(`/api/album/${mbidAlbum}`);
  }

  getAlbums(page: number): Observable<AlbumDto[]> {
    return this.http
      .get<GetAlbumsResponseDto>(`/api/albums/page/${page}`)
      .pipe(map((response) => response.albums));
  }
}
