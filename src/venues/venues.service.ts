import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Venue } from './entities/venue.entity';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';
import { ApiResponse } from 'src/common/api-response';
import { VenueDetailDto } from './dto/venue-detail.dto';
import { venueListDto } from './dto/venue-list.dto';

@Injectable()
export class VenuesService {
  constructor(
    @InjectRepository(Venue)
    private readonly venueRepo: Repository<Venue>,
  ) {}

  async create(dto: CreateVenueDto): Promise<Venue> {
    const venue = this.venueRepo.create(dto);

    return await this.venueRepo.save(venue);
  }

  async findAll(): Promise<ApiResponse<venueListDto[]>> {
    const venues = await this.venueRepo.find({
      select: {
        id: true,
        venueName: true,
        description: true,
        address: true,
        rating: true,
        venueImageUrl: true,
      },
    });

    const result: venueListDto[] = venues.map((v) => ({
      id: v.id,
      venueName: v.venueName,
      description: v.description,
      address: v.address,
      rating: v.rating,
      venueImageUrl: v.venueImageUrl,
    }));

    return new ApiResponse(
      'SUCCESS',
      'Venue list retrieved successfully',
      result,
    );
  }

  async findOne(venueId: number): Promise<ApiResponse<VenueDetailDto>> {
    const venue = await this.venueRepo.findOne({
      where: {
        id: venueId,
      },
      relations: {
        owner: true,
        courts: {
          category: true,
          timeSlots: {
            booking: true,
          },
        },
        // bookings: {
        //   timeSlot: true,
        // },
      },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    const result: VenueDetailDto = {
      id: venue.id,
      venueName: venue.venueName,
      description: venue.description,
      address: venue.address,
      rating: venue.rating,
      venueImageUrl: venue.venueImageUrl,

      courts: venue.courts.map((court) => ({
        id: court.id,
        courtName: court.courtName,
        type: court.type,
        pricePerHour: Number(court.pricePerHour),

        category: court.category
          ? {
              id: court.category.id,
              name: court.category.name,
            }
          : null,

        timeSlots: court.timeSlots.map((slot) => ({
          id: slot.id,
          date: slot.date,
          startTime: slot.startTime,
          endTime: slot.endTime,
          status: slot.status,

          booking: slot.booking
            ? {
                id: slot.booking.id,
                status: slot.booking.status,
                totalPrice: Number(slot.booking.totalPrice),
              }
            : null,
        })),
      })),
    };

    return new ApiResponse('SUCCESS', `Venue ${result.id} retrieved successfully`, result);
  }

  async update(id: number, dto: UpdateVenueDto) {
    await this.venueRepo.update({ id: id }, dto);

    return this.findOne(id);
  }

  async remove(id: number) {
    const venue = await this.venueRepo.findOne({
      where: {
        id: id,
      },
    });

    if (!venue) {
      throw new NotFoundException('Venue not found');
    }

    await this.venueRepo.remove(venue);

    return new ApiResponse('SUCCESS', 'Venue deleted successfully', null);
  }
}
