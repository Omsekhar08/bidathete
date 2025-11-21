import { Injectable, BadRequestException, ConflictException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Bid, BidDocument } from './entities/bid.entity';
import { Player, PlayerDocument } from '../players/entities/player.entity';
import { Team, TeamDocument } from '../teams/entities/team.entity';
import { Auction, AuctionDocument, AuctionStatus } from '../auctions/entities/auction.entity';

@Injectable()
export class BidsService {
  private readonly logger = new Logger(BidsService.name);

  constructor(
    @InjectModel(Bid.name) private bidModel: Model<BidDocument>,
    @InjectModel(Player.name) private playerModel: Model<PlayerDocument>,
    @InjectModel(Team.name) private teamModel: Model<TeamDocument>,
    @InjectModel(Auction.name) private auctionModel: Model<AuctionDocument>,
  ) {}

  async placeBid(data: {
    auctionId: string;
    playerId?: string;
    teamId?: string;
    amount: number;
    userId?: string;
    channel?: any;
  }) {
    // Convert incoming ids to ObjectId
    const auctionObjId = new Types.ObjectId(data.auctionId);
    const playerObjId = data.playerId ? new Types.ObjectId(data.playerId) : undefined;
    const teamObjId = data.teamId ? new Types.ObjectId(data.teamId) : undefined;

    // Validate auction
    const auction = await this.auctionModel.findById(auctionObjId).lean();
    if (!auction || auction.status !== AuctionStatus.LIVE) {
      throw new BadRequestException('Auction is not live');
    }

    // Validate player
    if (!playerObjId) throw new BadRequestException('playerId required');
    const player = await this.playerModel.findOne({ _id: playerObjId, auctionId: auctionObjId }).lean();
    if (!player) throw new BadRequestException('Player not found');
    if (player.soldToTeamId) throw new BadRequestException('Player already sold');

    // Validate team
    if (!teamObjId) throw new BadRequestException('teamId required');
    const team = await this.teamModel.findOne({ _id: teamObjId, auctionId: auctionObjId }).lean();
    if (!team) throw new BadRequestException('Team not found');

    // Get highest bid for player
    const highestBid = await this.bidModel.findOne({ playerId: playerObjId }).sort({ amount: -1 }).lean();

    const minBidIncrement = (auction as any)?.settings?.minBidIncrement || 100;
    const minAmount = highestBid ? highestBid.amount + minBidIncrement : player.basePrice;

    if (data.amount < minAmount) {
      throw new BadRequestException(`Minimum bid amount is ${minAmount}`);
    }

    // Check team budget
    const remainingBudget = (team.budget || 0) - (team.spentAmount || 0);
    if (data.amount > remainingBudget) {
      throw new BadRequestException('Insufficient team budget');
    }

    // Create and save bid
    const created = new this.bidModel({
      auctionId: auctionObjId,
      playerId: playerObjId,
      teamId: teamObjId,
      amount: data.amount,
      bidChannel: data.channel ?? undefined,
      accepted: false,
      userId: data.userId ? new Types.ObjectId(data.userId) : undefined,
    });

    const saved = await created.save();

    // populate player/team for return — await each populate on the document
    await (saved as any).populate('playerId');
    await (saved as any).populate('teamId');

    // normalize returned object shape (id props and populated fields)
    const result = {
      id: (saved as any)._id,
      auctionId: (saved as any).auctionId,
      playerId: (saved as any).playerId,
      teamId: (saved as any).teamId,
      amount: (saved as any).amount,
      bidChannel: (saved as any).bidChannel,
      accepted: (saved as any).accepted,
      userId: (saved as any).userId,
      createdAt: (saved as any).createdAt,
      player: (saved as any).playerId,
      team: (saved as any).teamId,
    };

    return result;
  }

  async acceptBid(bidId: string): Promise<void> {
    const bid = await this.bidModel.findById(bidId);
    if (!bid) throw new BadRequestException('Bid not found');

    // Update player
    await this.playerModel.findByIdAndUpdate(bid.playerId, {
      soldToTeamId: bid.teamId,
      soldPrice: bid.amount,
      isUnsold: false,
    });

    // Update team spent amount
    await this.teamModel.updateOne({ _id: bid.teamId }, { $inc: { spentAmount: Number(bid.amount) } });

    // Mark bid as accepted
    await this.bidModel.updateOne({ _id: bid._id }, { accepted: true });
  }

  async getBidHistory(playerId: string): Promise<any[]> {
    const objId = new Types.ObjectId(playerId);
    return this.bidModel
      .find({ playerId: objId })
      .populate('teamId')
      .sort({ createdAt: -1 })
      .lean();
  }

  async getAuctionBids(auctionId: string): Promise<any[]> {
    const objId = new Types.ObjectId(auctionId);
    return this.bidModel
      .find({ auctionId: objId })
      .populate('playerId')
      .populate('teamId')
      .sort({ createdAt: -1 })
      .lean();
  }

  async create(payload: Partial<Bid>) {
    const b = new this.bidModel(payload);
    return b.save();
  }

  async listForAuction(auctionId: string, limit = 50) {
    return this.bidModel.find({ auctionId }).sort({ createdAt: -1 }).limit(limit).lean().exec();
  }
}