import { IsDateString, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateReservationDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '고객 ID',
  })
  customerId: number;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '판매자 ID',
  })
  sellerId: number;


  @IsDateString()
  @ApiProperty({
    example: '2023-12-25',
    description: '예약 날짜',
  })
  date: string;
}
