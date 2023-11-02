import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  login(password: string, twoFactorToken: string): Observable<object> {
    return this.http.post(`/api/auth/login`, {
      password,
      twoFactorToken,
    });
  }
}
