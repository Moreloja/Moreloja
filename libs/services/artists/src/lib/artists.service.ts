import { Injectable, inject, Signal } from '@angular/core';
import {
  HttpClient,
  httpResource,
  HttpResourceRef,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  ArtistDto,
  GetArtistResponse,
  GetArtistsResponse,
} from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class ArtistsService {
  private http = inject(HttpClient);

  getArtist(mbidAlbumArtist: string): Observable<GetArtistResponse> {
    return this.http.get<GetArtistResponse>(`/api/artist/${mbidAlbumArtist}`);
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
}
