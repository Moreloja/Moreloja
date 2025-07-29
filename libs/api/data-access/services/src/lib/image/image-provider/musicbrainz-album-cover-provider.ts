import { Injectable } from '@nestjs/common';

@Injectable()
export class MusicBrainzAlbumCoverProvider {
  async provideAlbumCover(musicbrainzalbum: string): Promise<string> {
    return this.getCoverUrl(musicbrainzalbum);
  }

  private getCoverUrl(musicbrainzalbum: string): string {
    return `https://coverartarchive.org/release/${musicbrainzalbum}/front-250`;
  }
}
