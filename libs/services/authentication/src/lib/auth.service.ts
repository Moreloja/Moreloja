import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, catchError, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false,
  );

  isLoggedIn(): Observable<boolean> {
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
          this.isLoggedIn$.next(true);
          this.error$.next('');
        }),
        catchError((err: HttpErrorResponse) => {
          this.error$.next(err.message);
          return EMPTY;
        }),
      );
  }

  logout(): Observable<object> {
    return this.http.post(`/api/auth/logout`, {}).pipe(
      tap(() => {
        this.isLoggedIn$.next(false);
        this.error$.next('');
      }),
    );
  }
}
