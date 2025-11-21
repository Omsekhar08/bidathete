import { Controller, Get, Put, Param, Body, UseGuards } from '@nestjs/common';
import { OverlaysService } from './overlays.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('overlays')
export class OverlaysController {
  constructor(private overlays: OverlaysService) {}

  @Get()
  async list() {
    return { success: true, data: await this.overlays.list() };
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return { success: true, data: await this.overlays.findById(id) };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin')
  async update(@Param('id') id: string, @Body() body) {
    return { success: true, data: await this.overlays.update(id, body) };
  }
}