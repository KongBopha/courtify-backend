import { CategoryDto } from "./venue-detail.dto";

export class venueListDto {
  id: number;
  venueName: string;
  description: string | null;
  address: string;
  rating: number;
  venueImageUrl: string | null;

}