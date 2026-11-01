import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { User } from 'src/users/entities/user.entity';
import { Court } from 'src/courts/entities/court.entity';
import { Booking } from 'src/bookings/entities/booking.entity';

export enum VenueApprovalStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
}

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.venues, {
    onDelete: 'CASCADE',
  })
  owner: User;

  @Column()
  venueName: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description: string | null;

  @Column()
  address: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    nullable: true,
  })
  latitude: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    nullable: true,
  })
  longitude: number | null;

  @Column({
    type: 'enum',
    enum: VenueApprovalStatus,
    default: VenueApprovalStatus.PENDING,
  })
  approvalStatus: VenueApprovalStatus;

  @Column({
    type: 'float',
    default: 0,
  })
  rating: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  venueImage: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  venueImageUrl: string | null;

  @OneToMany(() => Court, (court) => court.venue)
  courts: Court[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
