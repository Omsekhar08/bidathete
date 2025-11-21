import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  body?: string;

  // explicit type to avoid "Cannot determine a type" error
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  data?: any;

  @Prop({ default: false })
  read?: boolean;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);