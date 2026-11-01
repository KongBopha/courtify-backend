import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  OneToOne,
  Index,
} from 'typeorm';

import { Court } from 'src/courts/entities/court.entity';
import { Booking } from 'src/bookings/entities/booking.entity';

export enum TimeSlotStatus {
  AVAILABLE = 'available',
  BOOKED = 'booked',
  DISABLED = 'disabled',
}

@Entity('time_slots')
@Index(['courtId', 'date', 'startTime', 'endTime'], {
  unique: true,
})
@Index(['courtId', 'date', 'status'])
export class TimeSlot {
  @PrimaryGeneratedColumn()
  id: number;

  // Which court this slot belongs to
@ManyToOne(() => Court, (court) => court.timeSlots, {
  onDelete: 'CASCADE',
})
court: Court;

@Column()
courtId: number;

  @Column('date')
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;

  @Column({
    type: 'enum',
    enum: TimeSlotStatus,
    default: TimeSlotStatus.AVAILABLE,
  })
  status: TimeSlotStatus;
  @OneToOne(() => Booking, (booking) => booking.timeSlot)
  booking: Booking;
  @CreateDateColumn()
  created_at: Date;
}
