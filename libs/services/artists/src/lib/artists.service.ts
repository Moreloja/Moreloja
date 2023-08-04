import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GetArtistResponseDto } from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class ArtistsService {
  private http = inject(HttpClient);

  getArtist(mbidAlbumArtist: string): Observable<GetArtistResponseDto> {
    return this.http.get<GetArtistResponseDto>(`/api/artist/${mbidAlbumArtist}`);
  }
}
