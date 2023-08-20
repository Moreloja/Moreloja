import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { AsyncPipe, NgIf } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { Observable, map, switchMap, tap } from 'rxjs';

import { AlbumsService } from '@moreloja/services/albums';
import { AlbumDto } from '@moreloja/api/data-access-dtos';

import { AlbumsContainerComponent } from '../albums-container/albums-container.component';
import { PaginationComponent } from '../pagination/pagination.component';

@Component({
  selector: 'moreloja-albums',
  standalone: true,
  imports: [AsyncPipe, NgIf, AlbumsContainerComponent, PaginationComponent],
  templateUrl: './albums.component.html',
  styleUrls: ['./albums.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AlbumsComponent implements OnInit {
  albums$!: Observable<AlbumDto[]>;
  albumsService = inject(AlbumsService);
  page$!: Observable<number>;

  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.page$ = this.route.params.pipe(map((param) => Number(param['page'])));
    this.albums$ = this.page$.pipe(
      tap((page) => {
        this.titleService.setTitle(`Moreloja - Albums - Page ${page}`);
      }),
      switchMap((page) => this.albumsService.getAlbums(page))
    );
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }
}
