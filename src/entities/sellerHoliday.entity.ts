import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('sellerHoliday')
export class SellerHoliday {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name:'sellerId' })
  sellerId: number;

  @Column({ name: 'weeklyHoliday',nullable: true})
  weeklyHoliday: number;

  @Column({ name: 'specificHoliday',nullable: true})
  specificHoliday: Date;
}