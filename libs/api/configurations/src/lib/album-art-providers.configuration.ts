import { Inject, Logger } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

import { ArtProviders, ArtProviderSource } from './art-providers';

export const albumArtProvidersConfiguration = registerAs(
  'album-art-providers',
  (): ArtProviders => {
    const providersEnv = process.env['MORELOJA_ALBUM_ART_PROVIDERS'];

    Logger.debug('Album Art Providers: ' + providersEnv);
    if (providersEnv === undefined) {
      return {
        providers: ['MusicBrainz', 'Deezer'] as ArtProviderSource[],
      };
    } else if (providersEnv === '') {
      return {
        providers: [] as ArtProviderSource[],
      };
    } else {
      const providers = providersEnv.split(',').filter((p) => p);
      return {
        providers: providers as ArtProviderSource[],
      };
    }
  },
);

export type AlbumArtProvidersConfiguration = ConfigType<
  typeof albumArtProvidersConfiguration
>;

export const InjectAlbumArtProvidersConfig = () =>
  Inject(albumArtProvidersConfiguration.KEY);
