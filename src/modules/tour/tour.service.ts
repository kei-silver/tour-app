import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tour } from 'src/entities/tour.entity';
import { Repository } from 'typeorm';
import { TourRepository } from './tour.repository';


@Injectable()
export class TourService {
  constructor(
    private readonly tourRepository: TourRepository,
  ) {}

  async updateReservationLimit(tourId: number, newLimit: number): Promise<Tour> {
    const tour = await this.tourRepository.findOne({ where: { id: tourId } });
    if (!tour) {
      throw new Error('Tour not found');
    }
    
    tour.reservationLimit = newLimit;
    return await this.tourRepository.save(tour);
  }
}
