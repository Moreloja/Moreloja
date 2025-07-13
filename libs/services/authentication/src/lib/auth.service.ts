import { Injectable, inject, Signal, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { EMPTY, Observable, catchError, tap } from 'rxjs';

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

  private error = signal<string>('');

  getError(): Signal<string> {
    return this.error;
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
          this.error.set('');
        }),
        catchError((err: HttpErrorResponse) => {
          this.error.set(err.message);
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
        this.error.set(error.message);
      },
    });
  }

  logout(): Observable<object> {
    return this.http.get(`/api/auth/logout`).pipe(
      tap(() => {
        this.isLoggedInSignal.set(false);
        this.error.set('');
      }),
    );
  }
}
