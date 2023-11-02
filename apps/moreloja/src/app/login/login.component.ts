import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { AuthService } from '@moreloja/services/authentication';

@Component({
  selector: 'moreloja-login',
  standalone: true,
  imports: [AsyncPipe, NgIf, ReactiveFormsModule],
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

  login() {
    this.authService
      .login(this.passwordControl.value, this.twoFactorTokenControl.value)
      .subscribe();
  }
}
