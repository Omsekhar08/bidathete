import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

export type PlayerDocument = Player & Document;

@Schema({ timestamps: true })
export class Player {
  @Prop({ required: true })
  name: string;

  @Prop()
  position?: string;

  @Prop()
  teamId?: string;

  // explicit type to avoid "Cannot determine a type" error
  @Prop({ type: mongoose.Schema.Types.Mixed, default: {} })
  metadata?: any;
}

export const PlayerSchema = SchemaFactory.createForClass(Player);