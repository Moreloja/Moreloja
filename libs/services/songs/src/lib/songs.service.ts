import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  GetAllSongsResponseDto,
  GetTopSongsResponseDto,
} from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  private http = inject(HttpClient);

  getAllSongs(
    mbidArtist: string,
    page: number
  ): Observable<GetAllSongsResponseDto> {
    return this.http.get<GetAllSongsResponseDto>(
      `/api/songs/artist/${mbidArtist}/page/${page}`
    );
  }

  getTopSongs(page: number): Observable<GetTopSongsResponseDto> {
    return this.http.get<GetTopSongsResponseDto>(`/api/top-songs/page/${page}`);
  }

  getAllSongsByTrack(
    mbidTrack: string,
    page: number
  ): Observable<GetAllSongsResponseDto> {
    return this.http.get<GetAllSongsResponseDto>(
      `/api/song/${mbidTrack}/page/${page}`
    );
  }
}
