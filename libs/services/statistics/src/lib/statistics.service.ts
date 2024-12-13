import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { GetStatisticsDto } from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private http = inject(HttpClient);

  getStatistics(): Observable<GetStatisticsDto> {
    return this.http.get<GetStatisticsDto>(`/api/statistics`);
  }
}
