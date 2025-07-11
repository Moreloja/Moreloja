import { Injectable, Signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpResourceRef, httpResource } from '@angular/common/http';

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
    page: number,
  ): Observable<GetAllSongsResponseDto> {
    return this.http.get<GetAllSongsResponseDto>(
      `/api/songs/artist/${mbidArtist}/page/${page}`,
    );
  }

  getTopSongs(
    range: Signal<string>,
    page: Signal<number>,
  ): HttpResourceRef<GetTopSongsResponseDto> {
    return httpResource(
      () => ({
        url: `/api/top-songs/${range()}/page/${page()}`,
      }),
      {
        defaultValue: new GetTopSongsResponseDto([]),
      },
    );
  }

  getAllSongsByTrack(
    mbidTrack: Signal<string>,
    page: Signal<number>,
  ): HttpResourceRef<GetAllSongsResponseDto> {
    return httpResource(
      () => ({
        url: `/api/song/${mbidTrack()}/page/${page()}`,
      }),
      {
        defaultValue: new GetAllSongsResponseDto([]),
      },
    );
  }
}
