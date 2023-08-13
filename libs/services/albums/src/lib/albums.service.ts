import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';

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

  private readonly albumCovers: {
    [mbidAlbum: string]: BehaviorSubject<string>;
  } = {};

  getAlbum(mbidAlbum: string): Observable<GetAlbumResponseDto> {
    return this.http.get<GetAlbumResponseDto>(`/api/album/${mbidAlbum}`);
  }

  getAlbums(): Observable<AlbumDto[]> {
    return this.http
      .get<GetAlbumsResponseDto>(`/api/albums`)
      .pipe(map((response) => response.albums));
  }

  getAlbumCover(mbidAlbum: string): Observable<string> {
    if (this.albumCovers[mbidAlbum]) {
      return this.albumCovers[mbidAlbum].asObservable();
    }

    this.albumCovers[mbidAlbum] = new BehaviorSubject<string>(
      // TODO Placeholder image is different for every pictrs server
      '2d8649a6-96ff-48d5-a133-36da61261edd.webp'
    );
    this.http
      .get<GetImageResponseDto>(`/api/image/album/${mbidAlbum}`)
      .subscribe({
        next: (response) => {
          this.albumCovers[mbidAlbum].next(response.image_url);
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
