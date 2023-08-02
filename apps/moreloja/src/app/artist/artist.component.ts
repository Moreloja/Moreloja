import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'moreloja-artist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './artist.component.html',
  styleUrls: ['./artist.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistComponent {

  _artistName!: string;
  
  @Input()
  set artistName(artistName: string) {
    this._artistName = artistName;
  }
}
