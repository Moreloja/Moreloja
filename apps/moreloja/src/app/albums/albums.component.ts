import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { distinctUntilChanged, map } from 'rxjs';

import { AlbumsService } from '@moreloja/services/albums';
import { Order, Range, Sort } from '@moreloja/shared/global-constants';

import { AlbumsContainerComponent } from '../albums-container/albums-container.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { RangeSelectionComponent } from '../range-selection/range-selection.component';
import { RangeDisplayComponent } from '../range-display/range-display.component';

@Component({
  selector: 'moreloja-albums',
  imports: [
    AlbumsContainerComponent,
    PaginationComponent,
    RangeSelectionComponent,
    RangeDisplayComponent,
    RouterModule,
  ],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlbumsComponent {
  sortings: { label: string; sort: Sort }[] = [
    { label: 'Play Time', sort: Sort.PlayTime },
    { label: 'Year', sort: Sort.Year },
  ];
  orderings: { label: string; order: Order }[] = [
    { label: '↑', order: Order.Ascending },
    { label: '↓', order: Order.Descending },
  ];

  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);

  sortBy = toSignal(
    this.route.params.pipe(
      map((param) => param['sortBy'] ?? Sort.Year),
      distinctUntilChanged(),
    ),
    { initialValue: Sort.Year },
  );
  order = toSignal(
    this.route.params.pipe(
      map((param) => param['order'] ?? Order.Descending),
      distinctUntilChanged(),
    ),
    { initialValue: Order.Descending },
  );
  range = toSignal(
    this.route.params.pipe(
      map((param) => param['range'] ?? Range.All),
      distinctUntilChanged(),
    ),
    { initialValue: Range.All },
  );
  page = toSignal(
    this.route.params.pipe(map((param) => Number(param['page'] ?? 1))),
    { initialValue: 1 },
  );

  albums = inject(AlbumsService).getAlbums(
    this.range,
    this.sortBy,
    this.order,
    this.page,
  );

  constructor() {
    effect(() => {
      this.titleService.setTitle(`Moreloja - Albums - Page ${this.page()}`);
    });
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
