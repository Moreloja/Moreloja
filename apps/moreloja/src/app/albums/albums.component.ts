import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable, distinctUntilChanged, map, switchMap, tap } from 'rxjs';

import { AlbumsService } from '@moreloja/services/albums';
import { AlbumDto } from '@moreloja/api/data-access-dtos';
import { Order, Range, Sort } from '@moreloja/shared/global-constants';

import { AlbumsContainerComponent } from '../albums-container/albums-container.component';
import { PaginationComponent } from '../pagination/pagination.component';
import { RangeSelectionComponent } from '../range-selection/range-selection.component';

@Component({
  selector: 'moreloja-albums',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgFor,
    AlbumsContainerComponent,
    PaginationComponent,
    RangeSelectionComponent,
    RouterModule,
  ],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlbumsComponent implements OnInit {
  sortings: { label: string; sort: Sort }[] = [
    { label: 'Play Time', sort: Sort.PlayTime },
    { label: 'Year', sort: Sort.Year },
  ];
  orderings: { label: string; order: Order }[] = [
    { label: '↑', order: Order.Ascending },
    { label: '↓', order: Order.Descending },
  ];
  albums$!: Observable<AlbumDto[]>;
  range$!: Observable<string>;
  page$!: Observable<number>;
  sortBy$!: Observable<Sort>;
  order$!: Observable<Order>;

  albumsService = inject(AlbumsService);

  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.sortBy$ = this.route.params.pipe(
      map((param) => param['sortBy'] ?? Sort.Year),
      distinctUntilChanged()
    );
    this.order$ = this.route.params.pipe(
      map((param) => param['order'] ?? Order.Descending),
      distinctUntilChanged()
    );
    this.range$ = this.route.params.pipe(
      map((param) => param['range'] ?? Range.All),
      distinctUntilChanged()
    );
    this.page$ = this.route.params.pipe(
      map((param) => Number(param['page'] ?? 1))
    );
    this.albums$ = this.range$.pipe(
      switchMap((range) =>
        this.sortBy$.pipe(
          switchMap((sortBy) =>
            this.order$.pipe(
              switchMap((order) =>
                this.page$.pipe(
                  tap((page) => {
                    this.titleService.setTitle(
                      `Moreloja - Albums - Page ${page}`
                    );
                  }),
                  switchMap((page) =>
                    this.albumsService.getAlbums(range, sortBy, order, page)
                  )
                )
              )
            )
          )
        )
      )
    );
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
