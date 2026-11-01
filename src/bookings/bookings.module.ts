import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from './entities/booking.entity';
import { Venue } from '../venues/entities/venue.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';
import { TimeSlot } from 'src/timeslots/entities/timeslot.entity';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Booking, TimeSlot,User]),
  ],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}