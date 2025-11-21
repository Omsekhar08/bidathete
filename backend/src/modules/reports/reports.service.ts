import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auction } from '../auctions/schemas/auction.schema';
import { Bid } from '../bids/schemas/bid.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReportsService {
  constructor(
    @InjectModel(Auction.name) private auctionModel: Model<Auction>,
    @InjectModel(Bid.name) private bidModel: Model<Bid>,
  ) {}

  async auctionSummary() {
    const totalAuctions = await this.auctionModel.countDocuments().exec();
    const open = await this.auctionModel.countDocuments({ status: 'open' }).exec();
    const closed = await this.auctionModel.countDocuments({ status: 'closed' }).exec();
    const totalBids = await this.bidModel.countDocuments().exec();
    return { totalAuctions, open, closed, totalBids };
  }

  async bidsForAuction(auctionId: string) {
    return this.bidModel.find({ auctionId }).sort({ createdAt: -1 }).lean().exec();
  }
}