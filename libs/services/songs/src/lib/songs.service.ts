import { Injectable, Signal } from '@angular/core';
import { HttpResourceRef, httpResource } from '@angular/common/http';

import {
  GetAllSongsResponseDto,
  GetTopSongsResponseDto,
} from '@moreloja/api/data-access/dtos';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  getAllSongs(
    mbidArtist: Signal<string>,
    page: Signal<number>,
  ): HttpResourceRef<GetAllSongsResponseDto> {
    return httpResource(
      () => ({
        url: `/api/songs/artist/${mbidArtist()}/page/${page()}`,
      }),
      {
        defaultValue: new GetAllSongsResponseDto([]),
      },
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

  getTotalPagesByArtist(mbidArtist: Signal<string>): HttpResourceRef<number> {
    return httpResource(
      () => ({
        url: `/api/songs/artist/${mbidArtist()}/total-pages`,
      }),
      {
        defaultValue: 1,
      },
    );
  }

  getTotalPagesByTrack(mbidTrack: Signal<string>): HttpResourceRef<number> {
    return httpResource(
      () => ({
        url: `/api/song/${mbidTrack()}/total-pages`,
      }),
      {
        defaultValue: 1,
      },
    );
  }

  getTotalPagesForTopSongs(range: Signal<string>): HttpResourceRef<number> {
    return httpResource(
      () => ({
        url: `/api/top-songs/${range()}/total-pages`,
      }),
      {
        defaultValue: 1,
      },
    );
  }
}
