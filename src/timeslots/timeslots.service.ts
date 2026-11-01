import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TimeSlot, TimeSlotStatus } from './entities/timeslot.entity';
import { Court } from 'src/courts/entities/court.entity';
import { CreateTimeslotDto } from './dto/create-timeslot.dto';
import { ApiResponse } from 'src/common/api-response';

@Injectable()
export class TimeslotsService {
  constructor(
    @InjectRepository(TimeSlot)
    private readonly timeSlotRepo: Repository<TimeSlot>,

    @InjectRepository(Court)
    private readonly courtRepo: Repository<Court>,
  ) {}

  // CREATE TIMESLOT
  async create(dto: CreateTimeslotDto) {
    const court = await this.courtRepo.findOne({
      where: {
        id: dto.courtId,
      },
    });

    if (!court) {
      throw new NotFoundException('Court not found');
    }

    // Check overlap
    const overlapSlot = await this.timeSlotRepo
      .createQueryBuilder('slot')
      .where('slot.courtId = :courtId', {
        courtId: dto.courtId,
      })
      .andWhere('slot.date = :date', {
        date: dto.date,
      })
      .andWhere(':startTime < slot.endTime AND :endTime > slot.startTime', {
        startTime: dto.startTime,
        endTime: dto.endTime,
      })
      .getOne();

    if (overlapSlot) {
      throw new BadRequestException('Timeslot overlaps with existing slot');
    }

    const slot = this.timeSlotRepo.create({
      court,
      date: dto.date,
      startTime: dto.startTime,
      endTime: dto.endTime,
      status: TimeSlotStatus.AVAILABLE,
    });

    const savedSlot = await this.timeSlotRepo.save(slot);

    return new ApiResponse(
      'SUCCESS',
      'Time slot created successfully',
      savedSlot,
    );
  }

  // GET ALL SLOTS
  async findAll() {
    const slots = await this.timeSlotRepo.find({
      relations: {
        court: true,
      },
      order: {
        date: 'ASC',
        startTime: 'ASC',
      },
    });

    return new ApiResponse(
      'SUCCESS',
      'All timeslots retrieved successfully.',
      slots,
    );
  }
  async findAvailable(courtId: number, date: string) {
    const slots = await this.timeSlotRepo.find({
      where: {
        court: {
          id: courtId,
        },
        date,
        status: TimeSlotStatus.AVAILABLE,
      },
      order: {
        startTime: 'ASC',
      },
    });

    return new ApiResponse(
      'SUCCESS',
      'Available timeslots retrieved successfully.',
      slots,
    );
  }

  // GET ONE SLOT
  async findOne(id: number) {
    const slot = await this.timeSlotRepo.findOne({
      where: {
        id,
      },
      relations: {
        court: true,
      },
    });

    if (!slot) {
      throw new NotFoundException('Time slot not found');
    }

    return new ApiResponse(
      'SUCCESS',
      'Time slot retrieved successfully.',
      slot,
    );
  }

  // UPDATE SLOT
  async update(id: number, dto: Partial<CreateTimeslotDto>) {
    const slot = await this.timeSlotRepo.findOne({
      where: {
        id,
      },
    });

    if (!slot) {
      throw new NotFoundException('Time slot not found');
    }

    Object.assign(slot, dto);

    const updated = await this.timeSlotRepo.save(slot);

    return new ApiResponse(
      'SUCCESS',
      'Time slot updated successfully.',
      updated,
    );
  }

  // DELETE SLOT
  async remove(id: number) {
    const slot = await this.timeSlotRepo.findOne({
      where: {
        id,
      },
    });

    if (!slot) {
      throw new NotFoundException('Time slot not found');
    }

    await this.timeSlotRepo.remove(slot);

    return new ApiResponse('SUCCESS', 'Time slot deleted successfully.', null);
  }
  async disable(id: number) {
    const slot = await this.timeSlotRepo.findOne({
      where: {
        id,
      },
    });

    if (!slot) {
      throw new NotFoundException('Time slot not found');
    }

    slot.status = TimeSlotStatus.DISABLED;

    const updated = await this.timeSlotRepo.save(slot);

    return new ApiResponse(
      'SUCCESS',
      'Time slot disabled successfully.',
      updated,
    );
  }
}
