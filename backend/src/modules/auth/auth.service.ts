import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RevokedToken } from './schemas/revoked-token.schema';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    @InjectModel(RevokedToken.name) private revokedTokenModel: Model<RevokedToken>,
  ) {}

  async register(payload: { email: string; password: string; name?: string }) {
    const existing = await this.usersService.findByEmail(payload.email);
    if (existing) throw new ConflictException('Email already in use');
    const hash = await bcrypt.hash(payload.password, 10);
    const user = await this.usersService.create({ ...payload, password: hash });
    const { password, ...rest } = user as any;
    return rest;
  }

  async validateUser(identifier: string, password?: string) {
    if (typeof password === 'string') {
      const user = await this.usersService.findByEmail(identifier);
      if (!user) return null;
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return null;
      const { password: _p, ...safe } = user as any;
      return safe;
    } else {
      try {
        const user = await this.usersService.findById(identifier);
        const { password: _p, ...safe } = user as any;
        return safe;
      } catch (e) {
        return null;
      }
    }
  }

  async validateOAuthUser(profile: { email?: string; name?: string; id?: string }, provider: string) {
    if (!profile.email && !profile.id) throw new UnauthorizedException('OAuth profile missing identifier');
    const email = profile.email || `${provider}_${profile.id}@no-email.local`;
    let user = await this.usersService.findByEmail(email);
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      user = await this.usersService.create({
        email,
        password: await bcrypt.hash(randomPassword, 10),
        name: profile.name,
        authProvider: provider,
      } as any);
    }
    const { password: _p, ...safe } = user as any;
    return safe;
  }

  async login(payload: { email: string; password: string }) {
    const user = await this.usersService.findByEmail(payload.email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const ok = await bcrypt.compare(payload.password, user.password);
    if (!ok) throw new UnauthorizedException('Invalid credentials');
    const token = this.jwtService.sign({ sub: user._id, role: user.role, email: user.email });
    const refresh = this.jwtService.sign({ sub: user._id }, { expiresIn: '7d' });
    return { accessToken: token, refreshToken: refresh, user: { id: user._id, email: user.email, name: user.name, role: user.role } };
  }

  async refresh(refreshToken: string) {
    const isRevoked = await this.revokedTokenModel.findOne({ token: refreshToken });
    if (isRevoked) throw new UnauthorizedException('Invalid refresh token');

    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersService.findById(payload.sub);
      const token = this.jwtService.sign({ sub: user._id, role: user.role, email: user.email });
      return { accessToken: token };
    } catch (e) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(refreshToken: string) {
    await this.revokedTokenModel.create({ token: refreshToken });
    return { success: true, message: 'Logged out successfully' };
  }

  async findById(id: string) {
    try {
      return await this.usersService.findById(id);
    } catch (e) {
      throw new NotFoundException('User not found');
    }
  }
}
