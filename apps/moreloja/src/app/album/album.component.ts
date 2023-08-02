import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'moreloja-album',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './album.component.html',
  styleUrls: ['./album.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlbumComponent {}
