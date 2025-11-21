import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async profile(@Req() req) {
    return { success: true, data: await this.usersService.findById(req.user.id) };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @Roles('admin')
  async list() {
    return { success: true, data: await this.usersService.findAll() };
  }

  @Post()
  @Roles('admin')
  async create(@Body() body) {
    return { success: true, data: await this.usersService.create(body) };
  }

  @Get(':id')
  @Roles('admin')
  async get(@Param('id') id: string) {
    return { success: true, data: await this.usersService.findById(id) };
  }

  @Put(':id')
  @Roles('admin')
  async update(@Param('id') id: string, @Body() body) {
    return { success: true, data: await this.usersService.update(id, body) };
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
    return { success: true };
  }
}