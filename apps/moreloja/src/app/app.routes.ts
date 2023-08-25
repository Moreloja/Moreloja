import { Route } from '@angular/router';

const title = 'Moreloja';

export const appRoutes: Route[] = [
    {
        path: '',
        title: `${title} - Home`,
        loadComponent: () => import('./home/home.component')
    },
    {
        path: 'album/:mbidAlbumInput',
        title: `${title} - Album`,
        loadComponent: () => import('./album/album.component')
    },
    {
        path: 'albums',
        redirectTo: 'albums/page/1',
        pathMatch: 'full'
    },
    {
        path: 'albums/page/:page',
        loadComponent: () => import('./albums/albums.component')
    },
    {
        path: 'artist/:mbidAlbumArtistInput',
        title: `${title} - Artist`,
        loadComponent: () => import('./artist/artist.component')
    },
    {
        path: 'artists',
        redirectTo: 'artists/page/1',
        pathMatch: 'full'
    },
    {
        path: 'artists/page/:page',
        title: `${title} - Artists`,
        loadComponent: () => import('./artists/artists.component')
    },
    {
        path: 'song/:mbidTrack/page/:page',
        loadComponent: () => import('./song/song.component')
    },
    {
        path: 'songs',
        redirectTo: 'songs/page/1',
        pathMatch: 'full'
    },
    {
        path: 'songs/page/:page',
        loadComponent: () => import('./songs/songs.component')
    },
    {
        path: 'songs/artist/:mbidArtist/page/:page',
        loadComponent: () => import('./songs/songs.component')
    },
    {
        path: 'top-songs',
        redirectTo: 'top-songs/page/1',
        pathMatch: 'full'
    },
    {
        path: 'top-songs/page/:page',
        loadComponent: () => import('./top-songs/top-songs.component')
    }
];
