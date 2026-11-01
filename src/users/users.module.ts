import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Booking } from 'src/bookings/entities/booking.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User,Booking])],
  exports: [TypeOrmModule],
})
export class UsersModule {}