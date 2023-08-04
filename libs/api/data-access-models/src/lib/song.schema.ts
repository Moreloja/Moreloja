import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SongDocument = HydratedDocument<Song>;

@Schema({ collection: 'playback-info' })
export class Song {
  @Prop()
  public Album?: string;

  @Prop()
  public Artist?: string;

  @Prop()
  public Name?: string;

  @Prop()
  public timestamp?: string;

  @Prop()
  public Provider_musicbrainzalbum?: string;

  @Prop()
  public Provider_musicbrainzalbumartist?: string;

  @Prop()
  public Provider_musicbrainzartist?: string;

  @Prop()
  public Provider_musicbrainzreleasegroup?: string;

  @Prop()
  public Provider_musicbrainztrack?: string;

  @Prop()
  public run_time?: number;
}

export const SongSchema = SchemaFactory.createForClass(Song);
