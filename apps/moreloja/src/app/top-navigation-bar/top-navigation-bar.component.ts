import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from '@moreloja/services/authentication';

@Component({
  selector: 'moreloja-top-navigation-bar',
  imports: [RouterModule],
  templateUrl: './top-navigation-bar.component.html',
  styleUrls: ['./top-navigation-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TopNavigationBarComponent {
  authService = inject(AuthService);
  isLoggedIn = this.authService.isLoggedIn();

  logout() {
    this.authService.logout().subscribe();
  }
}
