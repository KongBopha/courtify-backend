import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../auth/auth.decorator';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(
    @GetUser() user,
    @Body() dto: CreateBookingDto,
  ) {
    return this.bookingsService.createBooking(user, dto);
  }

  @Get('me')
  findMyBookings(@GetUser() user) {
    return this.bookingsService.findUserBookings(user.id);
  }

  @Post(':id/cancel')
  cancel(
    @GetUser() user,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.bookingsService.cancelBooking(id, user.id);
  }
}