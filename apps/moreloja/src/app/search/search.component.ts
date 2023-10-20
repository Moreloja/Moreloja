import { AsyncPipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  Observable,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
  tap,
} from 'rxjs';

import { SearchResultDto } from '@moreloja/api/data-access-dtos';
import { SearchService } from '@moreloja/services/search';

import { AlbumsContainerComponent } from '../albums-container/albums-container.component';

@Component({
  selector: 'moreloja-search',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    AlbumsContainerComponent,
    ReactiveFormsModule,
    RouterModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class SearchComponent implements OnInit {
  searchControl = new FormControl('', {
    nonNullable: true,
  });
  searchResult$!: Observable<SearchResultDto>;

  searchService = inject(SearchService);

  ngOnInit(): void {
    const searchInput = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    );

    this.searchResult$ = searchInput.pipe(
      switchMap((search) => this.searchService.find(search)),
    );
  }
}