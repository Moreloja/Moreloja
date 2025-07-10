import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'moreloja-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  readonly page = input.required<number>();

  readonly pageChange = output<number>();

  previousPage(): void {
    this.pageChange.emit(this.page() - 1);
  }

  nextPage(): void {
    this.pageChange.emit(this.page() + 1);
  }
}
