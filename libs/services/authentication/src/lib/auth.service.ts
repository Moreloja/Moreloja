import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

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

  login(password: string, twoFactorToken: string): Observable<object> {
    return this.http
      .post(`/api/auth/login`, {
        password,
        twoFactorToken,
      })
      .pipe(
        tap(() => {
          this.isLoggedIn$.next(true);
        }),
      );
  }
}
