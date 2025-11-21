import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { SponsorsService } from './sponsors.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('sponsors')
export class SponsorsController {
  constructor(private sponsors: SponsorsService) {}

  @Get()
  async list() {
    return { success: true, data: await this.sponsors.findAll() };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { success: true, data: await this.sponsors.findById(id) };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async create(@Body() body) {
    return { success: true, data: await this.sponsors.create(body) };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() body) {
    return { success: true, data: await this.sponsors.update(id, body) };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.sponsors.remove(id);
    return { success: true };
  }
}