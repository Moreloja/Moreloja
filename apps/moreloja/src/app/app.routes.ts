import { Route } from '@angular/router';

export const appRoutes: Route[] = [
    {
        path: 'album/:mbidAlbumInput',
        loadComponent: () => import('./album/album.component')
    },
    {
        path: 'albums',
        loadComponent: () => import('./albums/albums.component')
    },
    {
        path: 'artist/:mbidAlbumArtistInput',
        loadComponent: () => import('./artist/artist.component')
    },
    {
        path: 'artists',
        loadComponent: () => import('./artists/artists.component')
    },
    {
        path: 'song',
        loadComponent: () => import('./song/song.component')
    },
    {
        path: 'songs',
        loadComponent: () => import('./songs/songs.component')
    }
];
