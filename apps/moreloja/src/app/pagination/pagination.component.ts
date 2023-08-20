import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'moreloja-pagination',
  standalone: true,
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  @Input() page!: number;

  @Output() pageChange = new EventEmitter<number>();

  previousPage(): void {
    this.pageChange.emit(this.page - 1);
  }

  nextPage(): void {
    this.pageChange.emit(this.page + 1);
  }
}
