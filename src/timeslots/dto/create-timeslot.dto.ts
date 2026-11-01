import {
  IsDateString,
  IsInt,
  IsString,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTimeslotDto {
  @Type(() => Number)
  @IsInt()
  courtId: number;

  @IsDateString()
  date: string;

  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  startTime: string;

  @IsString()
  @Matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
  endTime: string;
}