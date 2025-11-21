import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Auction, AuctionSchema } from './schemas/auction.schema';
import { AuctionsService } from './auctions.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Auction.name, schema: AuctionSchema }])],
  providers: [AuctionsService],
  exports: [AuctionsService],
})
export class AuctionsModule {}