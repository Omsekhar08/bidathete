import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum AuctionStatus {
  DRAFT = 'draft',
  SCHEDULED = 'scheduled',
  LIVE = 'live',
  CLOSED = 'closed',
  ARCHIVED = 'archived',
}

@Schema({ timestamps: true })
export class Auction extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  organiserId: Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop()
  sportType: string;

  @Prop()
  description: string;

  @Prop()
  logoUrl: string;

  @Prop({ required: true })
  startTime: Date;

  @Prop({ required: true })
  endTime: Date;

  @Prop({ default: 'Asia/Kolkata' })
  timezone: string;

  @Prop({ type: String, enum: AuctionStatus, default: AuctionStatus.DRAFT })
  status: AuctionStatus;

  @Prop({ type: Object })
  settings: {
    minBidIncrement?: number;
    maxTeams?: number;
    maxPlayersPerTeam?: number;
    teamBudget?: number;
  };
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);

// Indexes
AuctionSchema.index({ organiserId: 1 });
AuctionSchema.index({ status: 1 });

export type AuctionDocument = Auction & Document;