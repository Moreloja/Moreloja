import { AsyncPipe, NgFor, NgIf } from '@angular/common';
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
} from 'rxjs';

import { SearchResultDto } from '@moreloja/api/data-access-dtos';
import { SearchService } from '@moreloja/services/search';

import { AlbumsContainerComponent } from '../albums-container/albums-container.component';
import {
  AlbumCoverCardComponent,
  AlbumCoverCardViewModel,
} from '../album-cover-card/album-cover-card.component';

@Component({
  selector: 'moreloja-search',
  standalone: true,
  imports: [
    AsyncPipe,
    NgFor,
    NgIf,
    AlbumCoverCardComponent,
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
  searchResult$!: Observable<
    SearchResultDto & {
      artistsForList: AlbumCoverCardViewModel[];
      songsForList: AlbumCoverCardViewModel[];
    }
  >;

  searchService = inject(SearchService);

  ngOnInit(): void {
    const searchInput = this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    );

    this.searchResult$ = searchInput.pipe(
      switchMap((search) => this.searchService.find(search)),
      map((searchResult) => {
        return {
          ...searchResult,
          artistsForList: searchResult.Artists.map((artist) => {
            return {
              name: artist.Artist,
              mbidArtist: artist.Provider_musicbrainzartist,
            };
          }),
          songsForList: searchResult.Songs.map((song) => {
            return {
              mbidAlbum: song.Provider_musicbrainzalbum,
              name: song.Song,
              mbidTrack: song.Provider_musicbrainztrack,
            };
          }),
        };
      }),
    );
  }
}
