import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export enum BillingStatus {
  PENDING = 'pending',
  PAID = 'paid',
  FAILED = 'failed',
}

@Schema({ timestamps: true })
export class Team extends Document {
  @Prop({ type: Types.ObjectId, ref: 'Auction', required: true })
  auctionId: Types.ObjectId;

  @Prop({ required: true })
  name: string;

  @Prop()
  logoUrl: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  managerId: Types.ObjectId;

  @Prop({ type: Number, default: 0 })
  budget: number;

  @Prop({ type: Number, default: 0 })
  spentAmount: number;

  @Prop({ type: String, enum: BillingStatus, default: BillingStatus.PENDING })
  billingStatus: BillingStatus;

  @Prop()
  paymentTransactionId: string;
}

export const TeamSchema = SchemaFactory.createForClass(Team);

TeamSchema.index({ auctionId: 1 });
TeamSchema.index({ managerId: 1 });

export type TeamDocument = Team & Document;