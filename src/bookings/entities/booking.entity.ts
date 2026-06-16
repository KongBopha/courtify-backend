import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Index } from 'typeorm';
import { User } from 'src/users/entities/user.entity';
import { Venue } from 'src/venues/entities/venue.entity';

@Entity('bookings')
@Index(['venue', 'date', 'startTime', 'endTime'])
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.bookings, { eager: true })
  user: User;

  @ManyToOne(() => Venue, (venue) => venue.bookings, { eager: true })
  venue: Venue;

  @Column()
  date: string;

  @Column()
  startTime: string;

  @Column()
  endTime: string;
}