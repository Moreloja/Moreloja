import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';

import { AuthService } from '@moreloja/services/authentication';

@Component({
  selector: 'moreloja-login',
  standalone: true,
  imports: [AsyncPipe, NgIf, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent implements OnInit {
  passwordControl = new FormControl('', {
    nonNullable: true,
  });
  twoFactorTokenControl = new FormControl('', {
    nonNullable: true,
  });

  isLoggedIn$!: Observable<boolean>;
  error$!: Observable<string>;

  authService = inject(AuthService);

  ngOnInit(): void {
    this.isLoggedIn$ = this.authService.isLoggedIn();
    this.error$ = this.authService.getError();
  }

  login() {
    this.authService
      .login(this.passwordControl.value, this.twoFactorTokenControl.value)
      .subscribe();
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
