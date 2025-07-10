import { Component, input } from '@angular/core';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'moreloja-json-modal-box',
  imports: [JsonPipe],
  templateUrl: './json-modal-box.component.html',
  styleUrls: ['./json-modal-box.component.css'],
})
export class JsonModalBoxComponent {
  readonly header = input.required<string>();

  readonly content = input.required<any>();

  showModal = false;

  toggleModal() {
    this.showModal = !this.showModal;
  }
}
