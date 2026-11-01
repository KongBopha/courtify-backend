import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VenuesService } from './venues.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import { UpdateVenueDto } from './dto/update-venue.dto';

@Controller('venues')
export class VenuesController {
  constructor(
    private readonly venuesService: VenuesService,
  ) {}

  @Post()
  create(@Body() dto: CreateVenueDto) {
    return this.venuesService.create(dto);
  }

  @Get()
  findAll() {
    return this.venuesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.venuesService.findOne(Number(id));
  }
}