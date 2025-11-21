import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OverlayDocument = Overlay & Document;

@Schema({ timestamps: true })
export class Overlay {
  @Prop({ required: true })
  name: string;

  @Prop()
  data?: any;
}

export const OverlaySchema = SchemaFactory.createForClass(Overlay);