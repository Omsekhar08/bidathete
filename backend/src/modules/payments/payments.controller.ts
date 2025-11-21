import { Controller, Post, Body, Req, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('payments')
export class PaymentsController {
  constructor(private payments: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('create')
  async create(@Body() body) {
    return { success: true, data: await this.payments.create(body) };
  }

  @Post('webhook')
  async webhook(@Req() req) {
    await this.payments.handleWebhook(req);
    return { success: true };
  }
}