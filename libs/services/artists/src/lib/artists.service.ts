import { Injectable, inject, Signal } from '@angular/core';
import {
  HttpClient,
  httpResource,
  HttpResourceRef,
} from '@angular/common/http';

import {
  ArtistDto,
  GetArtistResponse,
  GetArtistsResponse,
  ArtistTopWeeksDto,
} from '@moreloja/api/data-access/dtos';

@Injectable({
  providedIn: 'root',
})
export class ArtistsService {
  getArtist(
    mbidAlbumArtist: Signal<string>,
  ): HttpResourceRef<GetArtistResponse> {
    return httpResource(
      () => ({
        url: `/api/artist/${mbidAlbumArtist()}`,
      }),
      {
        defaultValue: new GetArtistResponse(
          'Loading Artist',
          new ArtistTopWeeksDto([], [], []),
          [],
          [],
          [],
          [],
        ),
      },
    );
  }

  getArtists(
    range: Signal<string>,
    page: Signal<number>,
  ): HttpResourceRef<ArtistDto[]> {
    return httpResource(
      () => ({
        url: `/api/artists/${range()}/page/${page()}`,
      }),
      {
        defaultValue: [],
        parse: (response: unknown) => {
          // TODO Use zod to check for GetArtistsResponse
          // For now cast to GetArtistsResponse
          return (response as GetArtistsResponse).artists;
        },
      },
    );
  }

  getTotalPages(range: Signal<string>): HttpResourceRef<number> {
    return httpResource(
      () => ({
        url: `/api/artists/${range()}/total-pages`,
      }),
      {
        defaultValue: 1,
      },
    );
  }
}
