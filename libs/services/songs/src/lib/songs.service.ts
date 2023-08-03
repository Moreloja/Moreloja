import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { GetAllSongsResponseDto } from '@moreloja/api/data-access-dtos';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  getAllSongs(): Observable<GetAllSongsResponseDto> {
    return of({
      songs: [
        {
          Album: 'The Last Stand',
          Artist: 'Sabaton',
          Name: 'Hill 3234',
          timestamp: '2023-08-01T10:49:35.620Z',
          Provider_musicbrainzalbum: '3e3737ab-cf23-4a39-be93-824cb8a4e3e2',
          run_time: 211,
        },
        {
          Album: 'The Last Album',
          Artist: 'Test Artist',
          Name: 'The Last Song',
          timestamp: '2023-08-01T11:49:35.620Z',
          Provider_musicbrainzalbum: '3e3737ab-cf23-4a39-be93-824cb8a4e3e2',
          run_time: 123,
        }
      ],
    });
  }
}
