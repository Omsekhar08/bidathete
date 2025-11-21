import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('notifications')
export class NotificationsController {
  constructor(private notifications: NotificationsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('send')
  async send(@Body() body) {
    return { success: true, data: await this.notifications.send(body) };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async list(@Req() req) {
    return { success: true, data: await this.notifications.listForUser(req.user.id) };
  }
}