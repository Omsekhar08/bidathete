import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification, NotificationDocument } from './schemas/notification.schema';
import { Model } from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(@InjectModel(Notification.name) private notifModel: Model<NotificationDocument>) {}

  async send(payload: Partial<Notification>) {
    const n = new this.notifModel(payload);
    return n.save();
    // integrate FCM/email here if required
  }

  async listForUser(userId: string, limit = 50) {
    return this.notifModel.find({ userId }).sort({ createdAt: -1 }).limit(limit).lean().exec();
  }
}