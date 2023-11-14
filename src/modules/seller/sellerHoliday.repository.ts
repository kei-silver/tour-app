import { EntityRepository, Repository } from 'typeorm';
import { SellerHoliday } from 'src/entities/sellerHoliday.entity';

@EntityRepository(SellerHoliday)
export class SellerHolidayRepository extends Repository<SellerHoliday> {
}
