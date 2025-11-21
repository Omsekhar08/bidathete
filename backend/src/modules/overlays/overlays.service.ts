import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Overlay, OverlayDocument } from './schemas/overlay.schema';
import { Model } from 'mongoose';

@Injectable()
export class OverlaysService {
  constructor(@InjectModel(Overlay.name) private overlayModel: Model<OverlayDocument>) {}

  async list() {
    return this.overlayModel.find().lean().exec();
  }

  async findById(id: string) {
    const o = await this.overlayModel.findById(id).lean().exec();
    if (!o) throw new NotFoundException('Overlay not found');
    return o;
  }

  async update(id: string, payload: Partial<Overlay>) {
    return this.overlayModel.findByIdAndUpdate(id, payload, { new: true }).lean().exec();
  }
}