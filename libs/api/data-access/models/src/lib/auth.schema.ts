import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AuthDocument = HydratedDocument<Auth>;

@Schema({ collection: 'auth' })
export class Auth {
  constructor(
    password: string,
    twoFactorSecret: string,
    refreshTokenHash: string,
  ) {
    this.password = password;
    this.twoFactorSecret = twoFactorSecret;
    this.refreshTokenHash = refreshTokenHash;
  }

  @Prop()
  password: string;

  @Prop()
  twoFactorSecret: string;

  @Prop()
  refreshTokenHash: string;
}

export const AuthSchema = SchemaFactory.createForClass(Auth);
