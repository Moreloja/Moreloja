import { Injectable, inject, Signal, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, EMPTY, Observable, catchError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private isLoggedInSignal = signal(false);

  isLoggedIn(): Signal<boolean> {
    if (!this.isLoggedInSignal()) {
      console.log('Refreshing');
      this.refresh();
    }
    return this.isLoggedInSignal;
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
          this.isLoggedInSignal.set(true);
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
        this.isLoggedInSignal.set(true);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoggedInSignal.set(false);
        this.error$.next(error.message);
      },
    });
  }

  logout(): Observable<object> {
    return this.http.get(`/api/auth/logout`).pipe(
      tap(() => {
        this.isLoggedInSignal.set(false);
        this.error$.next('');
      }),
    );
  }
}
