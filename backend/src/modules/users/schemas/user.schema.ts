import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop()
  name?: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop()
  avatar?: string;

  // allow seeds and oauth strategies to set provider
  @Prop({ default: AuthProvider.EMAIL })
  authProvider?: string;

  // added so seeds/types compile
  @Prop({ default: true })
  isActive?: boolean;

  @Prop()
  organisationName?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);