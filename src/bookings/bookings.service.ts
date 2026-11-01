import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';

import { Booking, BookingStatus } from './entities/booking.entity';
import { User } from 'src/users/entities/user.entity';
import {
  TimeSlot,
  TimeSlotStatus,
} from 'src/timeslots/entities/timeslot.entity';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ApiResponse } from '@nestjs/swagger';

@Injectable()
export class BookingsService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(Booking)
    private readonly bookingRepo: Repository<Booking>,

    @InjectRepository(User)
    private readonly userRepo: Repository<User>,

    @InjectRepository(TimeSlot)
    private readonly timeSlotRepo: Repository<TimeSlot>,
  ) {}

  async createBooking(user: any, dto: CreateBookingDto) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Validate user
      const dbUser = await queryRunner.manager.findOne(User, {
        where: { id: user.id },
      });

      if (!dbUser) {
        throw new NotFoundException('User not found');
      }

      // 2. Lock timeslot
      const timeSlot = await queryRunner.manager.findOne(TimeSlot, {
        where: { id: dto.timeSlotId },
        relations: { court: true },
        lock: { mode: 'pessimistic_write' },
      });

      if (!timeSlot) {
        throw new NotFoundException('Time slot not found');
      }

      // 3. Validate availability
      if (timeSlot.status !== TimeSlotStatus.AVAILABLE) {
        throw new BadRequestException('Time slot unavailable');
      }

      // 4. Create booking
      const booking = queryRunner.manager.create(Booking, {
        user: dbUser,
        timeSlot,
        totalPrice: Number(timeSlot.court.pricePerHour),
        status: BookingStatus.PENDING,
      });

      const savedBooking = await queryRunner.manager.save(Booking, booking);

      // 5. Update timeslot
      timeSlot.status = TimeSlotStatus.BOOKED;
      await queryRunner.manager.save(TimeSlot, timeSlot);

      // 6. Commit transaction
      await queryRunner.commitTransaction();

      return {
        status: 'SUCCESS',
        message: 'Your booking is created successfully',
        data: savedBooking,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(
        error || 'Booking failed',
      );
    } finally {
      await queryRunner.release();
    }
  };

  async findUserBookings(userId: number) {
    return this.bookingRepo.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        timeSlot: {
          court: {
            venue: true,
          },
        },
        payments: true,
      },
      order: {
        created_at: 'DESC',
      },
    });
  }

  async cancelBooking(
    bookingId: number,
    userId: number,
  ) {
    const booking = await this.bookingRepo.findOne({
      where: {
        id: bookingId,
        user: {
          id: userId,
        },
      },
      relations: {
        timeSlot: true,
      },
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    booking.status = BookingStatus.CANCELLED;

    booking.timeSlot.status = TimeSlotStatus.AVAILABLE;

    await this.timeSlotRepo.save(booking.timeSlot);

    return this.bookingRepo.save(booking);
  }
}