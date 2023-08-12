import { Route } from '@angular/router';

const title = 'Moreloja';

export const appRoutes: Route[] = [
    {
        path: 'album/:mbidAlbumInput',
        title: `${title} - Album`,
        loadComponent: () => import('./album/album.component')
    },
    {
        path: 'albums',
        title: `${title} - Albums`,
        loadComponent: () => import('./albums/albums.component')
    },
    {
        path: 'artist/:mbidAlbumArtistInput',
        title: `${title} - Artist`,
        loadComponent: () => import('./artist/artist.component')
    },
    {
        path: 'artists',
        title: `${title} - Artists`,
        loadComponent: () => import('./artists/artists.component')
    },
    {
        path: 'song',
        title: `${title} - Song`,
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
    }
];
