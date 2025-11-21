import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  ORGANISER = 'organiser',
  TEAM_MANAGER = 'team_manager',
  BIDDER = 'bidder',
}

export enum AuthProvider {
  EMAIL = 'email',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
}

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ select: false })
  password: string;

  @Prop({ type: String, enum: UserRole, default: UserRole.BIDDER })
  role: UserRole;

  @Prop({ type: String, enum: AuthProvider, default: AuthProvider.EMAIL })
  authProvider: AuthProvider;

  @Prop()
  profilePicture: string;

  @Prop()
  phone: string;

  @Prop()
  organisationName: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  lastLogin: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create indexes
UserSchema.index({ email: 1 });

export type UserDocument = User & Document;