import { Module } from '@nestjs/common';
import { TimeslotsService } from './timeslots.service';
import { TimeslotsController } from './timeslots.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlot } from './entities/timeslot.entity';
import { Booking } from 'src/bookings/entities/booking.entity';
import { Court } from 'src/courts/entities/court.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([TimeSlot,Court,Booking]),
  ],
  controllers: [TimeslotsController],
  providers: [TimeslotsService],
  exports:[TimeslotsService],
})
export class TimeslotsModule {}
