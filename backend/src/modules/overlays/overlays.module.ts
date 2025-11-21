import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Overlay, OverlaySchema } from './schemas/overlay.schema';
import { OverlaysService } from './overlays.service';
import { OverlaysController } from './overlays.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Overlay.name, schema: OverlaySchema }])],
  providers: [OverlaysService],
  controllers: [OverlaysController],
  exports: [OverlaysService],
})
export class OverlaysModule {}