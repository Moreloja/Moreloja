import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'album',
        loadComponent: () => import('./album/album.component').then(m => m.AlbumComponent)
    },
    {
        path: 'albums',
        loadComponent: () => import('./albums/albums.component').then(m => m.AlbumsComponent)
    },
    {
        path: 'artist',
        loadComponent: () => import('./artist/artist.component').then(m => m.ArtistComponent)
    },
    {
        path: 'artists',
        loadComponent: () => import('./artists/artists.component').then(m => m.ArtistsComponent)
    },
    {
        path: 'song',
        loadComponent: () => import('./song/song.component').then(m => m.SongComponent)
    },
    {
        path: 'songs',
        loadComponent: () => import('./songs/songs.component').then(m => m.SongsComponent)
    }
];
