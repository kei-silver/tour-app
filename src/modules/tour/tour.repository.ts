// tour.repository.ts
import { Tour } from 'src/entities/tour.entity';
import { EntityRepository, Repository } from 'typeorm';


@EntityRepository(Tour)
export class TourRepository extends Repository<Tour> {}
