import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

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

  getArtists(range: string, page: number): Observable<ArtistDto[]> {
    return this.http
      .get<GetArtistsResponse>(`/api/artists/${range}/page/${page}`)
      .pipe(map((response) => response.artists));
  }
}
