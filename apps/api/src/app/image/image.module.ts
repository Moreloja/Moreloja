import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import {
  ImageService,
  PictrsService,
  DbImageProvider,
  DownloadAlbumCoverProvider,
  PlaceholderAlbumCoverProvider,
  PlaceholderArtistCoverProvider,
  MusicBrainzAlbumCoverProvider,
  DeezerAlbumCoverProvider,
  DownloadArtistPictureProvider,
  DeezerArtistPictureProvider,
} from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

import { ImageController } from './image.controller';

@Module({
  imports: [HttpModule, DataAccessRepositoriesModule],
  controllers: [ImageController],
  providers: [
    ImageService,
    PictrsService,
    DbImageProvider,
    DownloadAlbumCoverProvider,
    DownloadArtistPictureProvider,
    PlaceholderAlbumCoverProvider,
    PlaceholderArtistCoverProvider,
    MusicBrainzAlbumCoverProvider,
    DeezerAlbumCoverProvider,
    DeezerArtistPictureProvider,
  ],
})
export class ImageModule {}
