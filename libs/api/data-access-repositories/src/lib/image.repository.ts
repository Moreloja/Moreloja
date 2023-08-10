import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Image } from '@moreloja/api/data-access-models';

@Injectable()
export class ImageRepository {
  constructor(@InjectModel(Image.name) private imageModel: Model<Image>) {}

  async getImageByMusicBrainzAlbum(
    musicbrainzid: string
  ): Promise<string | undefined> {
    const query = { musicbrainzid };
    const projection = { _id: 0, image: 1 };

    const result = await this.imageModel.findOne(query, projection).exec();

    if (result) {
      return result.image;
    } else {
      return undefined;
    }
  }

  async saveOrUpdateImageMetadata(
    musicbrainzalbum: string,
    image: string
  ): Promise<void> {
    const filter = { musicbrainzid: musicbrainzalbum };
    const updateOperation = {
      $set: { image: image },
    };
    const options = { upsert: true };
    await this.imageModel.updateOne(filter, updateOperation, options);
  }
}
