import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private jwtService: JwtService,
  ) {}

  private generateToken(user: User): string {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
  }

  async register(fullName: string, email: string, password: string) {
    const existing = await this.userRepo.findOne({
      where: { email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      fullName,
      email,
      password: hashedPassword,
    });

    const savedUser = await this.userRepo.save(user);

    const accessToken = this.generateToken(savedUser);

    return {
      access_token: accessToken,
      user: {
        id: savedUser.id,
        fullName: savedUser.fullName,
        email: savedUser.email,
      },
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Invalid credentials');
    }

    const accessToken = this.generateToken(user);

    return {
      access_token: accessToken,
      user: {
        id: user.id,
        fullName: user.fullName,
        email: user.email,
      },
    };
  }
}