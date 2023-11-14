import { EntityRepository, Repository } from 'typeorm';
import { TourReservation } from 'src/entities/tourReservation.entity';

@EntityRepository(TourReservation)
export class TourReservationRepository extends Repository<TourReservation> {
}
