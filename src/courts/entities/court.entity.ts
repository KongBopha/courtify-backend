import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany
} from 'typeorm';
import { Venue } from 'src/venues/entities/venue.entity';
import { Category } from 'src/categories/entities/category.entity';
import { TimeSlot } from 'src/timeslots/entities/timeslot.entity';
export enum CourtStatus {
  AVAILABLE = 'available',
  MAINTENANCE = 'maintenance',
  INACTIVE = 'inactive',
}
@Entity('courts')
export class Court {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  courtName: string;

  @Column({ nullable: true })
  type: string;

  @Column('decimal')
  pricePerHour: number;

  @ManyToOne(() => Venue, (venue) => venue.courts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'venueId' })
  venue: Venue;

  @ManyToOne(() => Category, (category) => category.courts, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column({
    type: 'enum',
    enum: CourtStatus,
    default: CourtStatus.AVAILABLE,
  })
  status: CourtStatus;

  @OneToMany(() => TimeSlot, (slot) => slot.court)
  timeSlots: TimeSlot[];
}
