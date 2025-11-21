import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(payload: Partial<User>) {
    const created = new this.userModel(payload);
    return created.save();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email }).lean().exec();
  }

  async findById(id: string) {
    const u = await this.userModel.findById(id).lean().exec();
    if (!u) throw new NotFoundException('User not found');
    return u;
  }

  async findAll() {
    return this.userModel.find().lean().exec();
  }

  async update(id: string, payload: Partial<User>) {
    return this.userModel.findByIdAndUpdate(id, payload, { new: true }).lean().exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).lean().exec();
  }
}