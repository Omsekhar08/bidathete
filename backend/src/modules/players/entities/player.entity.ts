import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum RegistrationStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Schema({ timestamps: true })
export class Player extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auctionId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ type: Object })
  details: {
    age?: number;
    position?: string;
    nationality?: string;
    stats?: Record<string, any>;
    imageUrl?: string;
  };

  @Prop({ type: Number, default: 0 })
  basePrice: number;

  @Prop({ type: String, enum: RegistrationStatus, default: RegistrationStatus.APPROVED })
  registrationStatus: RegistrationStatus;

  @Prop({ type: Types.ObjectId, ref: 'Team' })
  soldToTeamId: Types.ObjectId;

  @Prop({ type: Number })
  soldPrice: number;

  @Prop({ default: false })
  isUnsold: boolean;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);

PlayerSchema.index({ auctionId: 1 });
PlayerSchema.index({ soldToTeamId: 1 });
PlayerSchema.index({ registrationStatus: 1 });

export type PlayerDocument = Player & Document;
