import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PlayersService } from './players.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Get()
  async list() {
    return { success: true, data: await this.playersService.findAll() };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() body) {
    return { success: true, data: await this.playersService.create(body) };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { success: true, data: await this.playersService.findById(id) };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() body) {
    return { success: true, data: await this.playersService.update(id, body) };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string) {
    await this.playersService.remove(id);
    return { success: true };
  }

  @Post(':id/assign-team')
  @UseGuards(JwtAuthGuard)
  async assign(@Param('id') id: string, @Body() body: { teamId: string }) {
    return { success: true, data: await this.playersService.assignToTeam(id, body.teamId) };
  }
}