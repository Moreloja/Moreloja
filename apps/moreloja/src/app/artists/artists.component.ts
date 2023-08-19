import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
} from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { map, Observable, switchMap, tap } from 'rxjs';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Title } from '@angular/platform-browser';

import { ArtistsService } from '@moreloja/services/artists';
import { ArtistDto } from '@moreloja/api/data-access-dtos';

import PaginationComponent from '../pagination/pagination.component';

@Component({
  selector: 'moreloja-artists',
  standalone: true,
  imports: [AsyncPipe, NgFor, NgIf, PaginationComponent, RouterModule],
  templateUrl: './artists.component.html',
  styleUrls: ['./artists.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ArtistsComponent implements OnInit {
  artists$!: Observable<ArtistDto[]>;
  page$!: Observable<number>;

  private router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private artistsService = inject(ArtistsService);
  private titleService = inject(Title);

  ngOnInit(): void {
    this.page$ = this.route.params.pipe(map((param) => Number(param['page'])));
    this.artists$ = this.page$.pipe(
      tap((page) => {
        this.titleService.setTitle(`Moreloja - Artists - Page ${page}`);
      }),
      switchMap((page) => {
        return this.artistsService.getArtists(page);
      })
    );
  }

  onPageChange(page: number): void {
    this.router.navigate(['../', page], { relativeTo: this.route });
  }

  getPlayCountBarWidth(playCount: number, maxPlayCount: number): string {
    const percentage = (playCount / maxPlayCount) * 100;
    return percentage + '%';
  }
}
