import { Inject, Logger } from '@nestjs/common';
import { ConfigType, registerAs } from '@nestjs/config';

export type AlbumArtProviderType = 'MusicBrainz' | 'Deezer';

export interface AlbumArtProviders {
  providers: AlbumArtProviderType[];
}

export const albumArtProvidersConfiguration = registerAs(
  'album-art-providers',
  (): AlbumArtProviders => {
    const providersEnv = process.env['MORELOJA_ALBUM_ART_PROVIDERS'];

    Logger.debug('Album Art Providers: ' + providersEnv);
    if (providersEnv === undefined) {
      return {
        providers: ['MusicBrainz', 'Deezer'] as AlbumArtProviderType[],
      };
    } else if (providersEnv === '') {
      return {
        providers: [] as AlbumArtProviderType[],
      };
    } else {
      const providers = providersEnv.split(',').filter((p) => p);
      return {
        providers: providers as AlbumArtProviderType[],
      };
    }
  },
);

export type AlbumArtProvidersConfiguration = ConfigType<
  typeof albumArtProvidersConfiguration
>;

export const InjectAlbumArtProvidersConfig = () =>
  Inject(albumArtProvidersConfiguration.KEY);
