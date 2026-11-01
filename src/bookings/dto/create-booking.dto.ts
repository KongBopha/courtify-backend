import { IsInt, IsPositive } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
  @Type(() => Number)
  @IsInt()
  @IsPositive()
  timeSlotId!: number;
}