import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { Model } from 'mongoose';

@Injectable()
export class PaymentsService {
  constructor(@InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>) {}

  async create(payload: Partial<Payment>) {
    const p = new this.paymentModel({ ...payload, status: 'created' });
    return p.save();
  }

  async handleWebhook(req: any) {
    // store webhook payload minimal
    const payload = req.body || {};
    await this.paymentModel.create({ amount: payload.amount || 0, status: payload.status || 'webhook', metadata: payload });
    return true;
  }
}