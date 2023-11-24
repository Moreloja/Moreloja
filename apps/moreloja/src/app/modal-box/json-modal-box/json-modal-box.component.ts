import { Component, Input } from '@angular/core';
import { JsonPipe, NgIf } from '@angular/common';

@Component({
  selector: 'moreloja-json-modal-box',
  standalone: true,
  imports: [JsonPipe, NgIf],
  templateUrl: './json-modal-box.component.html',
  styleUrls: ['./json-modal-box.component.css'],
})
export class JsonModalBoxComponent {
  @Input()
  header!: string;

  @Input()
  content!: any;

  showModal = false;

  toggleModal() {
    this.showModal = !this.showModal;
  }
}
