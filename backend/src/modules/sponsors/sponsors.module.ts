import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sponsor, SponsorSchema } from './schemas/sponsor.schema';
import { SponsorsService } from './sponsors.service';
import { SponsorsController } from './sponsors.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: Sponsor.name, schema: SponsorSchema }])],
  providers: [SponsorsService],
  controllers: [SponsorsController],
  exports: [SponsorsService],
})
export class SponsorsModule {}