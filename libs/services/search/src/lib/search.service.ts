import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SearchResultDto } from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  private http = inject(HttpClient);

  find(search: string): Observable<SearchResultDto> {
    return this.http.get<SearchResultDto>(`/api/search/${search}`);
  }
}
