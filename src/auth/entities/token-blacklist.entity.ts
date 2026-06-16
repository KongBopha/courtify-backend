import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  CreateDateColumn,
} from 'typeorm';

@Entity('token_blacklist')
@Index('idx_jti', ['jti'])
@Index('idx_expiry', ['expiresAt'])
export class TokenBlacklist {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 500, unique: true })
  jti: string; // JWT ID (unique identifier for the token)

  @Column({ type: 'int' })
  userId: number;

  @Column({ type: 'datetime' })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
