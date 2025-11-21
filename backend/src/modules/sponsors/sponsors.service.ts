import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Sponsor, SponsorDocument } from './schemas/sponsor.schema';
import { Model } from 'mongoose';

@Injectable()
export class SponsorsService {
  constructor(@InjectModel(Sponsor.name) private sponsorModel: Model<SponsorDocument>) {}

  async create(payload: Partial<Sponsor>) {
    const s = new this.sponsorModel(payload);
    return s.save();
  }

  async findAll() {
    return this.sponsorModel.find().lean().exec();
  }

  async findById(id: string) {
    const s = await this.sponsorModel.findById(id).lean().exec();
    if (!s) throw new NotFoundException('Sponsor not found');
    return s;
  }

  async update(id: string, payload: Partial<Sponsor>) {
    return this.sponsorModel.findByIdAndUpdate(id, payload, { new: true }).lean().exec();
  }

  async remove(id: string) {
    return this.sponsorModel.findByIdAndDelete(id).lean().exec();
  }
}