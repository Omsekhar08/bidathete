import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRoot() {
    return {
      message: 'API is running',
      status: 'ok',
      version: process.env.npm_package_version ?? 'unknown',
    };
  }
}