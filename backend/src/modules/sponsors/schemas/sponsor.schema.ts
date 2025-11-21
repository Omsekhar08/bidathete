import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type SponsorDocument = Sponsor & Document;

@Schema({ timestamps: true })
export class Sponsor {
  @Prop({ required: true })
  name: string;

  @Prop()
  website?: string;

  // explicit type to avoid "Cannot determine a type" error
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  metadata?: any;
}

export const SponsorSchema = SchemaFactory.createForClass(Sponsor);