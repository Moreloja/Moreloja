import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  AlbumDto,
  GetAlbumResponseDto,
  GetAlbumsResponseDto,
} from '@moreloja/api/data-access-dtos';
import { Order, Sort } from '@moreloja/shared/global-constants';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {
  private http = inject(HttpClient);

  getAlbum(mbidAlbum: string): Observable<GetAlbumResponseDto> {
    return this.http.get<GetAlbumResponseDto>(`/api/album/${mbidAlbum}`);
  }

  getAlbums(range: string, sortBy: Sort, order: Order, page: number): Observable<AlbumDto[]> {
    return this.http
      .get<GetAlbumsResponseDto>(
        `/api/albums/${range}/sort/${sortBy}/${order}/page/${page}`
      )
      .pipe(map((response) => response.albums));
  }
}
