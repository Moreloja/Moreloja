export type ArtProviderSource = 'MusicBrainz' | 'Deezer';
export type ArtistArtProviderSource = 'Deezer';

export interface ArtProviders {
  providers: ArtProviderSource[];
}

export interface ArtistArtProviders {
  providers: ArtistArtProviderSource[];
}
