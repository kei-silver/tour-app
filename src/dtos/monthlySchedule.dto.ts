// src/tour/dto/monthly-schedule.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class MonthlyScheduleDto {
  @ApiProperty({ description: 'Year for monthly schedule', example: 2023 })
  @IsInt()
  @Min(1900)
  year: number;

  @ApiProperty({ description: 'Month for monthly schedule', example: 11 })
  @IsInt()
  @Min(1)
  month: number;
}
