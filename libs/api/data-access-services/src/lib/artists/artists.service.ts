import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { AlbumDto, GetArtistResponseDto, SongDto } from '@moreloja/api/data-access-dtos';
import { Song } from '@moreloja/api/data-access-models';

@Injectable()
export class ArtistsService {
  constructor(@InjectModel(Song.name) private songModel: Model<Song>) {}

  async getArtist(mbidAlbumArtist: string): Promise<GetArtistResponseDto> {
    const songs = await this.songModel
      .find({ Provider_musicbrainzalbumartist: mbidAlbumArtist })
      .sort({ timestamp: -1 }) // Sort by timestamp in descending order
      .limit(10)
      .exec();

    let artistName = '';
    if (songs.length) {
      artistName = songs[0].Artist ?? 'Unknown Artist';
    }

    const distinctAlbums = await this.songModel.aggregate([
        { $match: { Provider_musicbrainzalbumartist: mbidAlbumArtist } },
        { $group: { _id: '$Album', Provider_musicbrainzalbum: { $first: '$Provider_musicbrainzalbum' } } },
        { $project: { _id: 0, Album: '$_id', Provider_musicbrainzalbum: 1 } },
      ]);

    return new GetArtistResponseDto(
      artistName,
      distinctAlbums.map(
        (album) =>
          new AlbumDto(
            album.Album ?? '',
            album.Provider_musicbrainzalbum ?? ''
          )
      ),
      songs.map(
        (song) =>
          new SongDto(
            song.Album ?? '',
            song.Artist ?? '',
            song.Name ?? '',
            song.timestamp ?? '',
            song.Provider_musicbrainzalbum ?? '',
            song.Provider_musicbrainzalbumartist ?? '',
            song.run_time ?? 0
          )
      )
    );
  }
}
