import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Booking } from 'src/bookings/entities/booking.entity';

@Entity('venues')
export class Venue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  venueName: string;

  @Column()
  venueImage: string;

  @Column()
  venueImageUrl: string;

  @Column()
  location: string;

  @Column('float')
  distance: number;

  @Column()
  courts: number;

  @Column('float')
  rating: number;

  @Column('decimal', {
    precision: 10,
    scale: 2,
  })
  price: number;

  @OneToMany(() => Booking, (booking) => booking.venue)
  bookings: Booking[];
}