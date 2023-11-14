import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tourReservation')
export class TourReservation {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name:'customerId' })
  customerId: number;

  @Column({ name:'sellerId' })
  sellerId: number;

  @Column({ name:'tourId' })
  tourId: number;

  @Column({ name:'date'})
  date: Date;

  @Column({ default: 'pending' })
  status: string; 

  @Column({ name:'token' })
  token: string;

  @Column({ name:'tokenStatus' , default:'active' })
  tokenStatus: string; 

}
