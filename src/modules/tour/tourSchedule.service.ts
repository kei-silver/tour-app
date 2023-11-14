import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { SellerHoliday } from "src/entities/sellerHoliday.entity";
import { SellerHolidayRepository } from "../seller/sellerHoliday.repository";
import * as moment from 'moment';
import { InjectRedis, Redis } from "@nestjs-modules/ioredis";
import { TourRepository } from "./tour.repository";

@Injectable()
export class TourScheduleService {
  constructor(
    private readonly sellerHolidayRepository: SellerHolidayRepository,
    private readonly tourRepository: TourRepository,
    @InjectRedis() private readonly redisService: Redis
  ) {}

  private async getHolidaysForSeller(sellerId: number): Promise<SellerHoliday[]> {
    return this.sellerHolidayRepository.find({
      where: { sellerId: sellerId },
    });
  }


  async getTourSchedule(tourId: number, year: string, month: string): Promise<any> {
    const monthString = month.toString().padStart(2, '0');
    const yearMonth = `${year}-${monthString}`; // Format: YYYY-MM

    const tour = await this.tourRepository.findOne({ where: { id: tourId } });
    if (!tour) {
      throw new Error('Tour not found');
    }
    const sellerId = tour.sellerId;


    const cacheKey = `schedule:${sellerId}:${yearMonth}`;
    const cachedSchedule = await this.redisService.get(cacheKey);
    if (cachedSchedule) {
      console.log(cachedSchedule)
      return JSON.parse(cachedSchedule);
    }

   const schedule = await this.computeSchedule(sellerId, yearMonth);

   await this.redisService.set(cacheKey, JSON.stringify(schedule), 'EX', 60 * 60 * 24); // Expires in 24 hours

   return schedule;
  }

  private computeSchedule = async(sellerId: number, yearMonth: string): Promise<string[]> => {
    const sellerHolidays = await this.getHolidaysForSeller(sellerId);


    const weeklyHolidays: number[] = sellerHolidays.map(holiday => holiday.weeklyHoliday);

    const specificHolidays: string[] = sellerHolidays.map(holiday =>
      moment(holiday.specificHoliday).format('YYYY-MM-DD')
    );
    const schedule = [];
    const startOfMonth = moment(yearMonth, 'YYYY-MM').startOf('month');
    const endOfMonth = startOfMonth.clone().endOf('month');

    while (startOfMonth.isBefore(endOfMonth)) {
      const weekDay = startOfMonth.isoWeekday();
      const dateString = startOfMonth.format('YYYY-MM-DD');
      
 
      if (!weeklyHolidays.includes(weekDay) && !specificHolidays.includes(dateString)) {
        schedule.push(dateString); 
      }

      startOfMonth.add(1, 'days'); 
    }

    return schedule;
  }
}



