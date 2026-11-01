export class BookingDto {
  id: number;
  status: string;
  totalPrice: number;
}

export class TimeSlotDto {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  booking: BookingDto | null;
}

export class CategoryDto {
  id: number;
  name: string;
}

export class CourtDto {
  id: number;
  courtName: string;
  type: string;
  pricePerHour: number;
  category: CategoryDto | null;
  timeSlots: TimeSlotDto[];
}

export class VenueDetailDto {
  id: number;
  venueName: string;
  description: string | null;
  address: string;
  rating: number;
  venueImageUrl: string | null;

  courts: CourtDto[];
}