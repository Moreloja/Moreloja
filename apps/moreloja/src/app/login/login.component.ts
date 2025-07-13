import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '@moreloja/services/authentication';

@Component({
  selector: 'moreloja-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class LoginComponent {
  passwordControl = new FormControl('', {
    nonNullable: true,
  });
  twoFactorTokenControl = new FormControl('', {
    nonNullable: true,
  });

  authService = inject(AuthService);

  isLoggedIn = this.authService.isLoggedIn();
  error = this.authService.getError();

  login() {
    this.authService
      .login(this.passwordControl.value, this.twoFactorTokenControl.value)
      .subscribe();
  }

  logout() {
    this.authService.logout().subscribe();
  }
}
