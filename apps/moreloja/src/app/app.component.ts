import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

import TopNavigationBarComponent from './top-navigation-bar/top-navigation-bar.component';

@Component({
  imports: [RouterModule, TopNavigationBarComponent],
  selector: 'moreloja-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}
