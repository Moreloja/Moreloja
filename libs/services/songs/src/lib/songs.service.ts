import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SongsService {
  constructor() {}

  //getAllSongs(): Observable<GetAllSongsResponseDto> {
  getAllSongs(): Observable<any> {
    return of({
      songs: [
        {
          Album: 'The Last Stand',
          Artist: 'Sabaton',
          Name: 'Hill 3234',
          timestamp: '2023-08-01T10:49:35.620Z',
          timestamp_end: '2023-08-01T10:53:06.641Z',
          Provider_musicbrainzalbum: '3e3737ab-cf23-4a39-be93-824cb8a4e3e2',
          Year: 2016,
          playback_position_seconds: 210,
          run_time: 211,
        },
        {
          Album: 'The Last Album',
          Artist: 'Test Artist',
          Name: 'The Last Song',
          timestamp: '2023-08-01T11:49:35.620Z',
          timestamp_end: '2023-08-01T11:53:06.641Z',
          Provider_musicbrainzalbum: '3e3737ab-cf23-4a39-be93-824cb8a4e3e2',
          Year: 2019,
          playback_position_seconds: 123,
          run_time: 123,
        }
      ],
    });
  }
}
