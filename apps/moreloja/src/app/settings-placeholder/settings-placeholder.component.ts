import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

import {
  PlaceholderAlbumCover,
  PlaceholderArtistCover,
} from '@moreloja/shared/global-constants';

import { EditableImageComponent } from '../editable-image/editable-image.component';

@Component({
  selector: 'moreloja-settings-placeholder',
  standalone: true,
  imports: [AsyncPipe, NgIf, EditableImageComponent],
  templateUrl: './settings-placeholder.component.html',
  styleUrls: ['./settings-placeholder.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SettingsPlaceholderComponent {
  placeholderAlbumCover = PlaceholderAlbumCover;
  placeholderArtistCover = PlaceholderArtistCover;
}
