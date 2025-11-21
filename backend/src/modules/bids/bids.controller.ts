import { Controller, Post, Body, Get, Param, UseGuards, Req } from '@nestjs/common';
import { BidsGateway } from './bids.gateway';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('bids')
export class BidsController {
  constructor(private gateway: BidsGateway) {}

  // REST fallback to place bid (also broadcasts via WS gateway)
  @UseGuards(JwtAuthGuard)
  @Post('place')
  async placeBid(@Req() req, @Body() body: { auctionId: string; amount: number }) {
    const bid = {
      id: `bid_${Date.now()}`,
      auctionId: body.auctionId,
      amount: body.amount,
      userId: req.user.id,
      createdAt: new Date().toISOString(),
    };
    // push to gateway to broadcast to WS clients
    this.gateway.broadcastBid(bid);
    return { success: true, data: bid };
  }

  @Get('auction/:auctionId')
  async listForAuction(@Param('auctionId') auctionId: string) {
    // TODO: hook to bids service / repository
    return { success: true, data: [] };
  }
}