import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Bid, BidSchema } from './schemas/bid.schema';
import { BidsService } from './bids.service';
import { BidsGateway } from './bids.gateway';
import { BidsController } from './bids.controller';
import { Player, PlayerSchema } from '../players/schemas/player.schema';
import { Team, TeamSchema } from '../teams/schemas/team.schema';
import { Auction, AuctionSchema } from '../auctions/schemas/auction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Bid.name, schema: BidSchema },
      { name: Player.name, schema: PlayerSchema },
      { name: Team.name, schema: TeamSchema },
      { name: Auction.name, schema: AuctionSchema },
    ]),
  ],
  providers: [BidsService, BidsGateway],
  controllers: [BidsController],
  exports: [BidsService],
})
export class BidsModule {}