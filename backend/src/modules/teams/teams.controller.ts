import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { TeamsService } from './teams.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Get()
  async list() {
    return { success: true, data: await this.teamsService.findAll() };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { success: true, data: await this.teamsService.findById(id) };
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() body, @Req() req) {
    // created by current user
    const team = await this.teamsService.create({ ...body, ownerId: req.user.id });
    return { success: true, data: team };
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() body) {
    return { success: true, data: await this.teamsService.update(id, body) };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.teamsService.remove(id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Get('my/team')
  async myTeam(@Req() req) {
    return { success: true, data: await this.teamsService.findByOwner(req.user.id) };
  }
}