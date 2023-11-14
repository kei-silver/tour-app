import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ReservationLimitDto {
  @ApiProperty({
    description: '하루에 받을 수 있는 투어 예약의 최대 건수',
    example: 7
  })
  @IsNumber({}, { message: 'dailyLimit은 숫자여야 합니다.' })
  readonly reservationLimit: number;
}
