import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, catchError } from 'rxjs';

import {
  PlaceholderAlbumCover,
  PlaceholderArtistCover,
} from '@moreloja/shared/global-constants';
import { GetImageResponse } from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private http = inject(HttpClient);

  private placeholderAlbumCover: string | undefined;
  private placeholderArtistCover: string | undefined;

  private readonly images: {
    [mbid: string]: BehaviorSubject<string>;
  } = {};

  private error$ = new BehaviorSubject<string>('');

  getError(): Observable<string> {
    return this.error$.asObservable();
  }

  private getImage(
    mbid: string,
    placeholderId: string,
    getImage: (mbid: string) => Observable<GetImageResponse>,
  ): Observable<string> {
    if (this.images[mbid]) {
      return this.images[mbid].asObservable();
    }

    let placeholder: string | undefined;

    if (placeholderId === PlaceholderAlbumCover) {
      placeholder = this.placeholderAlbumCover;
    } else if (placeholderId === PlaceholderArtistCover) {
      placeholder = this.placeholderArtistCover;
    }

    if (!placeholder) {
      this.images[mbid] = new BehaviorSubject<string>('DoesNotExist.webp');

      getImage(placeholderId).subscribe({
        next: (response) => {
          if (placeholderId === PlaceholderAlbumCover) {
            this.placeholderAlbumCover = response.image_url;
          } else if (placeholderId === PlaceholderArtistCover) {
            this.placeholderArtistCover = response.image_url;
          }
          this.images[mbid].next(response.image_url);
        },
        error: () => {
          console.log(`No image found for ${mbid}.`);
        },
      });
    } else {
      this.images[mbid] = new BehaviorSubject<string>(placeholder);
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
        this.http.get<GetImageResponse>(`/api/image/album/${mbid}`),
    );
  }

  getArtistPicture(mbidArtist: string): Observable<string> {
    return this.getImage(
      mbidArtist,
      PlaceholderArtistCover,
      (mbid: string): Observable<GetImageResponse> =>
        this.http.get<GetImageResponse>(`/api/image/artist/${mbid}`),
    );
  }

  setImage(mbid: string, image: File): void {
    const formData = new FormData();
    formData.append('image', image);

    this.http
      .post<GetImageResponse>(`/api/image/album/${mbid}`, formData)
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.error$.next(err.message);
          return EMPTY;
        }),
      )
      .subscribe({
        next: (response) => {
          this.error$.next('');
          this.images[mbid].next(response.image_url);
        },
      });
  }
}
