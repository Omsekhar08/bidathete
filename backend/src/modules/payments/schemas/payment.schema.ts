import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
  @Prop({ required: true })
  amount: number;

  @Prop()
  currency?: string;

  @Prop()
  userId?: string;

  @Prop()
  status?: string;
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  metadata?: any;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);