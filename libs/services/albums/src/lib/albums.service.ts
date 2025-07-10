import { Injectable, Signal } from '@angular/core';
import { HttpResourceRef, httpResource } from '@angular/common/http';

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
  getAlbum(mbidAlbum: Signal<string>): HttpResourceRef<GetAlbumResponseDto> {
    return httpResource<GetAlbumResponseDto>(
      () => ({
        url: `/api/album/${mbidAlbum()}`,
      }),
      {
        defaultValue: new GetAlbumResponseDto(
          'Album',
          'Artist',
          'ArtistMbid',
          [],
          [],
        ),
        parse: (response: unknown) => {
          // TODO Use zod to check for GetAlbumResponseDto
          // For now cast to GetAlbumResponseDto
          return response as GetAlbumResponseDto;
        },
      },
    );
  }

  getAlbums(
    range: Signal<string>,
    sortBy: Signal<Sort>,
    order: Signal<Order>,
    page: Signal<number>,
  ): HttpResourceRef<AlbumDto[]> {
    return httpResource<AlbumDto[]>(
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
