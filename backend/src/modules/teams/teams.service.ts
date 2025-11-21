import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Team, TeamDocument } from './schemas/team.schema';
import { Model } from 'mongoose';

@Injectable()
export class TeamsService {
  constructor(@InjectModel(Team.name) private teamModel: Model<TeamDocument>) {}

  async create(payload: Partial<Team>) {
    const t = new this.teamModel(payload);
    return t.save();
  }

  async findAll() {
    return this.teamModel.find().lean().exec();
  }

  async findById(id: string) {
    const t = await this.teamModel.findById(id).lean().exec();
    if (!t) throw new NotFoundException('Team not found');
    return t;
  }

  async findByOwner(ownerId: string) {
    return this.teamModel.findOne({ ownerId }).lean().exec();
  }

  async update(id: string, payload: Partial<Team>) {
    return this.teamModel.findByIdAndUpdate(id, payload, { new: true }).lean().exec();
  }

  async remove(id: string) {
    return this.teamModel.findByIdAndDelete(id).lean().exec();
  }
}