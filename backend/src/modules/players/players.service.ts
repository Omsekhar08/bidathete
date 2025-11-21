import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Player, PlayerDocument } from './schemas/player.schema';
import { Model } from 'mongoose';

@Injectable()
export class PlayersService {
  constructor(@InjectModel(Player.name) private playerModel: Model<PlayerDocument>) {}

  async create(payload: Partial<Player>) {
    const p = new this.playerModel(payload);
    return p.save();
  }

  async findAll() {
    return this.playerModel.find().lean().exec();
  }

  async findById(id: string) {
    const p = await this.playerModel.findById(id).lean().exec();
    if (!p) throw new NotFoundException('Player not found');
    return p;
  }

  async update(id: string, payload: Partial<Player>) {
    return this.playerModel.findByIdAndUpdate(id, payload, { new: true }).lean().exec();
  }

  async remove(id: string) {
    return this.playerModel.findByIdAndDelete(id).lean().exec();
  }

  async assignToTeam(id: string, teamId: string) {
    return this.playerModel.findByIdAndUpdate(id, { teamId }, { new: true }).lean().exec();
  }
}