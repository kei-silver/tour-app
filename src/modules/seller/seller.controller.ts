import { Controller, Post, Param, Body, Patch, Get } from '@nestjs/common';
import { SellerService } from './seller.service';
import { SellerHolidayDto } from 'src/dtos/sellerHoliday.dto';
import { ApiOperation } from '@nestjs/swagger';
import { ResponseDto } from 'src/dtos/response.dto';



@Controller('seller')
export class SellerController {
  constructor(private readonly sellerService: SellerService) {}


  @ApiOperation({ summary: '[판매자] 판매자 휴일 정보 추가' })
  @Post(':sellerId/schedule/holidays')
  async setHolidays(
    @Param('sellerId') sellerId: number,
    @Body() sellerHolidayDto: SellerHolidayDto,
  ): Promise<ResponseDto<string>> {
    try {
      await this.sellerService.setHolidays(sellerId, sellerHolidayDto);
      return ResponseDto.OK_WITH('Holidays set successfully');
    } catch (error) {
      console.error(error);
      return ResponseDto.ERROR(error.message);
    }
  }
  
  @ApiOperation({ summary: '[판매자] 판매자의 휴일 정보 가져오기' })
  @Get(':sellerId/schedule')
  async getSellerSchedule(@Param('sellerId') sellerId: number){
    try {
      const schedule = await this.sellerService.getHolidays(sellerId);
      return ResponseDto.OK_WITH(schedule);
    } catch (error) {
      console.error(error);
      return ResponseDto.ERROR(error.message);
    }
  }
  


}
