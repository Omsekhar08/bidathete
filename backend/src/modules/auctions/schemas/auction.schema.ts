import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type AuctionDocument = Auction & Document;

@Schema({ timestamps: true })
export class Auction {
  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ default: 'draft' })
  status?: 'draft' | 'open' | 'closed';

  // explicit type to avoid "Cannot determine a type" error
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  metadata?: any;
}

export const AuctionSchema = SchemaFactory.createForClass(Auction);