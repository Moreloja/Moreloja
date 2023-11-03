import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private isLoggedIn$: BehaviorSubject<boolean> | undefined;

  isLoggedIn(): Observable<boolean> {
    if (this.isLoggedIn$ === undefined) {
      this.isLoggedIn$ = new BehaviorSubject<boolean>(false);
      this.refresh();
    }
    return this.isLoggedIn$.asObservable();
  }

  private error$ = new BehaviorSubject<string>('');

  getError(): Observable<string> {
    return this.error$.asObservable();
  }

  login(password: string, twoFactorToken: string): Observable<object> {
    return this.http
      .post(`/api/auth/login`, {
        password,
        twoFactorToken,
      })
      .pipe(
        tap(() => {
          this.isLoggedIn$?.next(true);
          this.error$.next('');
        }),
        catchError((err: HttpErrorResponse) => {
          this.error$.next(err.message);
          return EMPTY;
        }),
      );
  }

  private refresh(): void {
    this.http.get(`/api/auth/refresh`).subscribe({
      next: () => {
        this.isLoggedIn$?.next(true);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoggedIn$?.next(false);
        this.error$.next(error.message);
      },
    });
  }

  logout(): Observable<object> {
    return this.http.get(`/api/auth/logout`).pipe(
      tap(() => {
        this.isLoggedIn$?.next(false);
        this.error$.next('');
      }),
    );
  }
}
