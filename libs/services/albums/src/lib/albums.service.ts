import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

import { PlaceholderAlbumCover } from '@moreloja/shared/global-constants';
import {
  AlbumDto,
  GetAlbumResponseDto,
  GetAlbumsResponseDto,
  GetImageResponseDto,
} from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class AlbumsService {
  private http = inject(HttpClient);

  private placeholderAlbumCover: string | undefined;

  private readonly albumCovers: {
    [mbidAlbum: string]: BehaviorSubject<string>;
  } = {};

  getAlbum(mbidAlbum: string): Observable<GetAlbumResponseDto> {
    return this.http.get<GetAlbumResponseDto>(`/api/album/${mbidAlbum}`);
  }

  getAlbums(page: number): Observable<AlbumDto[]> {
    return this.http
      .get<GetAlbumsResponseDto>(`/api/albums/page/${page}`)
      .pipe(map((response) => response.albums));
  }

  getAlbumCover(mbidAlbum: string): Observable<string> {
    if (this.albumCovers[mbidAlbum]) {
      return this.albumCovers[mbidAlbum].asObservable();
    }

    if (!this.placeholderAlbumCover) {
      this.albumCovers[mbidAlbum] = new BehaviorSubject<string>(
        'DoesNotExist.webp'
      );

      this.http
        .get<GetImageResponseDto>(`/api/image/album/${PlaceholderAlbumCover}`)
        .subscribe({
          next: (response) => {
            this.placeholderAlbumCover = response.image_url;
            this.albumCovers[mbidAlbum].next(response.image_url);
          },
          error: () => {
            console.log(`No cover found for ${mbidAlbum}.`);
          },
        });
    } else {
      this.albumCovers[mbidAlbum] = new BehaviorSubject<string>(
        this.placeholderAlbumCover
      );
    }

    this.http
      .get<GetImageResponseDto>(`/api/image/album/${mbidAlbum}`)
      .subscribe({
        next: (response) => {
          this.albumCovers[mbidAlbum].next(response.image_url);
        },
        error: () => {
          console.log(`No cover found for ${mbidAlbum}.`);
        },
      });

    return this.albumCovers[mbidAlbum].asObservable();
  }

  setAlbumCover(mbidAlbum: string, image: File): void {
    const formData = new FormData();
    formData.append('image', image);

    this.http
      .post<GetImageResponseDto>(`/api/image/album/${mbidAlbum}`, formData)
      .subscribe({
        next: (response) => {
          this.albumCovers[mbidAlbum].next(response.image_url);
        },
      });
  }
}
