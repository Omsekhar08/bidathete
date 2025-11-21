import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Auction, AuctionDocument } from './schemas/auction.schema';
import { Model } from 'mongoose';

@Injectable()
export class AuctionsService {
  constructor(@InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>) {}

  async create(payload: Partial<Auction>) {
    const a = new this.auctionModel(payload);
    return a.save();
  }

  async findAll() {
    return this.auctionModel.find().lean().exec();
  }

  async findById(id: string) {
    const a = await this.auctionModel.findById(id).lean().exec();
    if (!a) throw new NotFoundException('Auction not found');
    return a;
  }

  async update(id: string, payload: Partial<Auction>) {
    return this.auctionModel.findByIdAndUpdate(id, payload, { new: true }).lean().exec();
  }

  async remove(id: string) {
    return this.auctionModel.findByIdAndDelete(id).lean().exec();
  }

  async start(id: string) {
    return this.update(id, { status: 'open' });
  }

  async end(id: string) {
    return this.update(id, { status: 'closed' });
  }

  async liveState(id: string) {
    const auction = await this.findById(id);
    // for now return auction + placeholder live payload
    return { auction, currentHighest: null };
  }
}