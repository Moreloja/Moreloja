import { Injectable, Signal, inject } from '@angular/core';
import {
  HttpClient,
  HttpResourceRef,
  httpResource,
} from '@angular/common/http';
import { Observable } from 'rxjs';

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

  getAlbums(
    range: Signal<string>,
    sortBy: Signal<Sort>,
    order: Signal<Order>,
    page: Signal<number>,
  ): HttpResourceRef<AlbumDto[]> {
    return httpResource(
      () => ({
        url: `/api/albums/${range()}/sort/${sortBy()}/${order()}/page/${page()}`,
      }),
      {
        defaultValue: [],
        parse: (response: unknown) => {
          // TODO Use zod to check for GetAlbumsResponseDto
          // For now cast to GetAlbumsResponseDto
          return (response as GetAlbumsResponseDto).albums;
        },
      },
    );
  }
}
