import { Controller, Get, Param } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private reports: ReportsService) {}

  @Get('auction/summary')
  async auctionSummary() {
    return { success: true, data: await this.reports.auctionSummary() };
  }

  @Get('auction/:id/bids')
  async bidsForAuction(@Param('id') id: string) {
    return { success: true, data: await this.reports.bidsForAuction(id) };
  }
}