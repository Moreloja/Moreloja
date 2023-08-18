import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import {
  ArtistDto,
  GetArtistResponseDto,
  GetArtistsResponseDto,
} from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class ArtistsService {
  private http = inject(HttpClient);

  getArtist(mbidAlbumArtist: string): Observable<GetArtistResponseDto> {
    return this.http.get<GetArtistResponseDto>(
      `/api/artist/${mbidAlbumArtist}`
    );
  }

  getArtists(page: number): Observable<ArtistDto[]> {
    return this.http
      .get<GetArtistsResponseDto>(`/api/artists/page/${page}`)
      .pipe(map((response) => response.artists));
  }
}
