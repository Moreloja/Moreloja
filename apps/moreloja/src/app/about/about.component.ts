import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'moreloja-about',
  standalone: true,
  imports: [],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AboutComponent {}
