import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Payment } from 'src/payments/entities/payment.entity';
import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venues/entities/venue.entity';
import { TimeSlot } from 'src/timeslots/entities/timeslot.entity';

export enum BookingStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  COMPLETED = 'completed',
}
@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings, {
    eager: true,
  })
  user: User;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  totalPrice: number;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.PENDING,
  })
  status: BookingStatus;

  @OneToMany(() => Payment, (payment) => payment.booking)
  payments: Payment[];

  @OneToOne(() => TimeSlot, (slot) => slot.booking)
  @JoinColumn()
  timeSlot: TimeSlot;

  @CreateDateColumn()
  created_at: Date;
}