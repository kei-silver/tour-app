import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNumber, IsOptional, IsString } from 'class-validator';

export class SellerHolidayDto {
  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 5,
    description: '주간 휴일을 나타내는 숫자입니다. 예: 5는 금요일을 의미합니다.',
  })
  weeklyHoliday: number;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: "2023-11-17",
    description: '특정 휴일을 나타내는 날짜입니다. ISO 8601 날짜 형식의 문자열이어야 합니다.',
  })
  specificHoliday: string;
}