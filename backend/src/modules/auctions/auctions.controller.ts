import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { AuctionsService } from './auctions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('auctions')
export class AuctionsController {
  constructor(private auctionsService: AuctionsService) {}

  @Get()
  async list() {
    return { success: true, data: await this.auctionsService.findAll() };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { success: true, data: await this.auctionsService.findById(id) };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  @Roles('organizer')
  async create(@Body() body) {
    return { success: true, data: await this.auctionsService.create(body) };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @Roles('organizer')
  async update(@Param('id') id: string, @Body() body) {
    return { success: true, data: await this.auctionsService.update(id, body) };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  @Roles('organizer')
  async remove(@Param('id') id: string) {
    await this.auctionsService.remove(id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/start')
  @Roles('organizer')
  async start(@Param('id') id: string) {
    return { success: true, data: await this.auctionsService.start(id) };
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/end')
  @Roles('organizer')
  async end(@Param('id') id: string) {
    return { success: true, data: await this.auctionsService.end(id) };
  }

  @Get(':id/live')
  async live(@Param('id') id: string) {
    return { success: true, data: await this.auctionsService.liveState(id) };
  }
}
