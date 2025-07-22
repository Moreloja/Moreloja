import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'moreloja-top-navigation-bar',
  imports: [RouterModule],
  templateUrl: './top-navigation-bar.component.html',
  styleUrls: ['./top-navigation-bar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class TopNavigationBarComponent {}
