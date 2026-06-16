import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan } from 'typeorm';
import { TokenBlacklist } from '../entities/token-blacklist.entity';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @InjectRepository(TokenBlacklist)
    private blacklistRepository: Repository<TokenBlacklist>,
  ) {}

  async addToBlacklist(jti: string, userId: number, expiresAt: Date) {
    const entry = this.blacklistRepository.create({
      jti,
      userId,
      expiresAt,
    });
    await this.blacklistRepository.save(entry);
  }

  async isBlacklisted(jti: string): Promise<boolean> {
    const entry = await this.blacklistRepository.findOne({ where: { jti } });
    return !!entry;
  }

  // Clean up expired tokens (call periodically or on-demand)
  async cleanupExpired() {
    const now = new Date();
    await this.blacklistRepository.delete({
      expiresAt: LessThan(now),
    });
  }
}
