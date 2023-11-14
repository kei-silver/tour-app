import { Injectable, NotFoundException, ForbiddenException, ConflictException } from '@nestjs/common';
import { SellerHolidayDto } from 'src/dtos/sellerHoliday.dto';
import { SellerHolidayRepository } from './sellerHoliday.repository';
import { SellerHoliday } from 'src/entities/sellerHoliday.entity';
import { InjectRedis, Redis } from '@nestjs-modules/ioredis';


@Injectable()
export class SellerService {
  constructor(
    private readonly sellerHolidayRepository:SellerHolidayRepository,
    @InjectRedis() private readonly redisService: Redis
  ) {}


  async setHolidays(sellerId: number, sellerHolidayDto:SellerHolidayDto): Promise<void> {
    // 주간 휴일이나 특정 휴일이 이미 설정되어 있는지 확인합니다.
    const existingHolidays = await this.sellerHolidayRepository.find({
      where: [
        { sellerId: sellerId, weeklyHoliday: sellerHolidayDto.weeklyHoliday }, // 주간 휴일 검증
        { sellerId: sellerId, specificHoliday: sellerHolidayDto.specificHoliday } // 특정 휴일 검증
      ]
    });

    // 기존에 같은 휴일 정보가 있다면 예외를 발생시킵니다.
    if (existingHolidays.length > 0) {
      throw new ConflictException('중복된 휴일 정보가 존재합니다.');
    }
    
    await this.sellerHolidayRepository.save({sellerId:sellerId,...sellerHolidayDto});

    // 캐시 삭제
     await this.clearScheduleCache(sellerId);
  }


  async getHolidays(sellerId: number): Promise<SellerHoliday[]> {
    const schedules = await this.sellerHolidayRepository.find({
      where: { sellerId: sellerId },
    });
    return schedules;
  }



  private async clearScheduleCache(sellerId: number): Promise<void> {
    const keysPattern = `schedule:${sellerId}:*`;

    const keys = await this.redisService.keys(keysPattern);

    const deletionPromises = keys.map(key => this.redisService.del(key));
    await Promise.all(deletionPromises);
  }

  
}
