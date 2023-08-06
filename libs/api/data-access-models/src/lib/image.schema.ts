import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ImageDocument = HydratedDocument<Image>;

@Schema({ collection: 'images' })
export class Image {
  @Prop({ unique: true, required: true })
  public musicbrainzid!: string;

  @Prop({ required: true })
  public image!: string;
}

export const ImageSchema = SchemaFactory.createForClass(Image);
