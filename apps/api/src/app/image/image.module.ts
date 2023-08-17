import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import {
  ImageService,
  PictrsService,
  DbAlbumCoverProvider,
  DownloadAlbumCoverProvider,
  PlaceholderAlbumCoverProvider,
  MusicBrainzAlbumCoverProvider,
  DeezerAlbumCoverProvider,
} from '@moreloja/api/data-access-services';
import { DataAccessRepositoriesModule } from '@moreloja/api/data-access-repositories';

import { ImageController } from './image.controller';

@Module({
  imports: [HttpModule, DataAccessRepositoriesModule],
  controllers: [ImageController],
  providers: [
    ImageService,
    PictrsService,
    DbAlbumCoverProvider,
    DownloadAlbumCoverProvider,
    PlaceholderAlbumCoverProvider,
    MusicBrainzAlbumCoverProvider,
    DeezerAlbumCoverProvider,
  ],
})
export class ImageModule {}
