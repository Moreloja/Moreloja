import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

import { PlaceholderAlbumCover } from '@moreloja/shared/global-constants';
import { GetImageResponse } from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient);

  private placeholderAlbumCover: string | undefined;

  private readonly images: {
    [mbid: string]: BehaviorSubject<string>;
  } = {};

  private getImage(
    mbid: string,
    placeholderId: string,
    getImage: (mbid: string) => Observable<GetImageResponse>
  ): Observable<string> {

    if (this.images[mbid]) {
      return this.images[mbid].asObservable();
    }

    if (!this.placeholderAlbumCover) {
      this.images[mbid] = new BehaviorSubject<string>('DoesNotExist.webp');

      getImage(placeholderId).subscribe({
        next: (response) => {
          this.placeholderAlbumCover = response.image_url;
          this.images[mbid].next(response.image_url);
        },
        error: () => {
          console.log(`No image found for ${mbid}.`);
        },
      });
    } else {
      this.images[mbid] = new BehaviorSubject<string>(
        this.placeholderAlbumCover
      );
    }

    getImage(mbid).subscribe({
      next: (response) => {
        this.images[mbid].next(response.image_url);
      },
      error: () => {
        console.log(`No image found for ${mbid}.`);
      },
    });

    return this.images[mbid].asObservable();
  }

  getAlbumCover(mbidAlbum: string): Observable<string> {
    return this.getImage(
      mbidAlbum,
      PlaceholderAlbumCover,
      (mbid: string): Observable<GetImageResponse> =>
        this.http.get<GetImageResponse>(`/api/image/album/${mbid}`)
    );
  }

  getArtistPicture(mbidArtist: string): Observable<string> {
    return this.getImage(
      mbidArtist,
      PlaceholderAlbumCover, // TODO Create one for artists
      (mbid: string): Observable<GetImageResponse> =>
        this.http.get<GetImageResponse>(`/api/image/artist/${mbid}`)
    );
  }

  setImage(mbid: string, image: File): void {
    const formData = new FormData();
    formData.append('image', image);

    this.http
      .post<GetImageResponse>(`/api/image/album/${mbid}`, formData)
      .subscribe({
        next: (response) => {
          this.images[mbid].next(response.image_url);
        },
      });
  }
}
