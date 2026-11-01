import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Court } from 'src/courts/entities/court.entity';

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  imageUrl: string | null;

  @OneToMany(() => Court, (court) => court.category)
  courts: Court[];
}