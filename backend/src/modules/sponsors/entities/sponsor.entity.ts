import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum SlotType {
  STATIC = 'static',
  ROTATING = 'rotating',
  PREMIUM = 'premium',
}

@Schema({ timestamps: true })
export class Sponsor extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auctionId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  logoUrl: string;

  @Prop({ type: String, enum: SlotType, default: SlotType.STATIC })
  slotType: SlotType;

  @Prop()
  startTime: Date;

  @Prop()
  endTime: Date;

  @Prop({ type: Number, default: 5 })
  displayDuration: number;

  @Prop({ default: true })
  isActive: boolean;
}

export const SponsorSchema = SchemaFactory.createForClass(Sponsor);
