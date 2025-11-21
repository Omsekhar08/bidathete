import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum BidChannel {
  WEB = 'web',
  MOBILE = 'mobile',
}

@Schema({ timestamps: true })
export class Bid extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auctionId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Player', required: true })
  playerId: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Team', required: true })
  teamId: Types.ObjectId;

  @Prop({ type: Number, required: true })
  amount: number;

  @Prop({ type: String, enum: BidChannel, default: BidChannel.WEB })
  bidChannel: BidChannel;

  @Prop({ default: false })
  accepted: boolean;
}

export const BidSchema = SchemaFactory.createForClass(Bid);

BidSchema.index({ auctionId: 1, playerId: 1 });
BidSchema.index({ teamId: 1 });
BidSchema.index({ createdAt: 1 });
BidSchema.index({ accepted: 1 });

export type BidDocument = Bid & Document;