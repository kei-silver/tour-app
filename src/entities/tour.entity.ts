import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tour')
export class Tour {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name:'sellerId' })
  sellerId: number;

  @Column({ name:'name'})
  name: string;

  @Column({ name:'reservationLimit', default: 5})
  reservationLimit: number; 

}
