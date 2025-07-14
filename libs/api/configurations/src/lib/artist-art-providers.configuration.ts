import { Inject, Logger } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

import { ArtistArtProviders, ArtistArtProviderSource } from './art-providers';

export const artistArtProvidersConfiguration = registerAs(
  'artist-art-providers',
  (): ArtistArtProviders => {
    const providersEnv = process.env['MORELOJA_ARTIST_ART_PROVIDERS'];

    Logger.debug('Artist Art Providers: ' + providersEnv);
    if (providersEnv === undefined) {
      return {
        providers: ['Deezer'] as ArtistArtProviderSource[],
      };
    } else if (providersEnv === '') {
      return {
        providers: [] as ArtistArtProviderSource[],
      };
    } else {
      const providers = providersEnv.split(',').filter((p) => p);
      return {
        providers: providers as ArtistArtProviderSource[],
      };
    }
  },
);

export type ArtistArtProvidersConfiguration = ConfigType<
  typeof artistArtProvidersConfiguration
>;

export const InjectArtistArtProvidersConfig = () =>
  Inject(artistArtProvidersConfiguration.KEY);
