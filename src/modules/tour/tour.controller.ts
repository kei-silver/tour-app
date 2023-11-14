import { Controller, Get, Param, Query, NotFoundException, Post, Delete, Body, Patch } from '@nestjs/common';
import { TourScheduleService } from './tourSchedule.service';
import { ResponseDto } from 'src/dtos/response.dto';
import { TourReservationService } from './tourReservation.service';
import { CreateReservationDto } from 'src/dtos/createReservation.dto';
import { ApiOperation } from '@nestjs/swagger';
import { TokenDto } from 'src/dtos/token.dto';
import { TourService } from './tour.service';
import { ReservationLimitDto } from 'src/dtos/reservationLimit.dto';
import { Tour } from 'src/entities/tour.entity';



@Controller('tour')
export class TourController {
  constructor(
    private readonly tourScheduleService: TourScheduleService,
    private readonly tourReservationService: TourReservationService,
    private readonly tourService: TourService
  ) {}



  @ApiOperation({ summary: '[고객] 해당 투어의 예약 가능 일정 조회' })
  @Get(':tourId/schedule')
  async getMonthlySchedule(
    @Param('tourId') tourId: number,
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<ResponseDto<any>> {
    try {
      return ResponseDto.OK_WITH(await this.tourScheduleService.getTourSchedule(tourId, year, month)); 
    } catch (error) {
        console.error(error);
        return ResponseDto.ERROR(error.message);
    }
  }



  @ApiOperation({ summary: '[고객] 투어 예약 생성' })
  @Post(':tourId/reservations')
  async createReservation(
    @Param('tourId') tourId: number,
    @Body() createReservationDto: CreateReservationDto
  ) {
    try {
      return ResponseDto.OK_WITH(await this.tourReservationService.createReservation(tourId, createReservationDto)); 
    } catch (error) {
        console.error(error);
        return ResponseDto.ERROR(error.message);
    }
  }



  @ApiOperation({ summary: '[고객] 투어 예약 취소' })
  @Patch('reservations/:reservationId/cancel')
  async cancelReservation(
    @Param('tourId') tourId: number,
    @Param('reservationId') tourReservationId: number
  ) {
    try {
      return ResponseDto.OK_WITH(await this.tourReservationService.cancelReservation(tourReservationId));
    } catch (error) {
        console.error(error);
        return ResponseDto.ERROR(error.message);
    }
  }


  @ApiOperation({ summary: '[판매자] 판매자가 예약 승인' })
  @Patch('reservations/:reservationId/approve')
  async approveTourReservation(@Param('reservationId') tourReservationId: number): Promise<ResponseDto<string>> {
    try {
      await this.tourReservationService.approveTourReservation(tourReservationId);
      return ResponseDto.OK_WITH('Reservation approved successfully');
    } catch (error) {
      console.error(error);
      return ResponseDto.ERROR(error.message);
    }
  }

  @ApiOperation({ summary: '[판매자] 토큰을 이용해 고객의 예약 여부 확인' })
  @Post('check-reservation')
  async checkReservation(@Body() { token }: TokenDto){
    try {
      const result = await this.tourReservationService.checkReservation(token);
      return ResponseDto.OK_WITH(result);
    } catch (error) {
      console.error(error);
      return ResponseDto.ERROR(error.message);
    }
  }


  @ApiOperation({ summary: '[판매자] 토큰을 이용해 고객의 투어 참여 상태 업데이트' })
  @Post('update-participation')
  async updateTourParticipationStatus(@Body() { token }: TokenDto){
    try {
      const result = await this.tourReservationService.updateTourParticipationStatus(token);
      return ResponseDto.OK_WITH(result);
    } catch (error) {
      console.error(error);
      return ResponseDto.ERROR(error.message);
    }
  }


  @ApiOperation({ summary: '[판매자] 대기 중인 예약 확인' })
  @Get('seller/:sellerId/pending-reservations')
  async getPendingReservations(@Param('sellerId') sellerId: number){
    try {
      const reservations = await this.tourReservationService.findPendingReservations(sellerId);
      return ResponseDto.OK_WITH(reservations);
    } catch (error) {
      console.error(error);
      return ResponseDto.ERROR(error.message);
    }
  }


  @ApiOperation({ summary: '[판매자] 투어의 자동 승인 개수 변경 - 추가 기능' })
  @Post(':tourId/reservation-limits')
  async updateDailyReservationLimit(
    @Param('tourId') tourId: number,
    @Body() {reservationLimit}: ReservationLimitDto
  ) {
    try {
      return ResponseDto.OK_WITH(await this.tourService.updateReservationLimit(tourId, reservationLimit));
    } catch (error) {
      console.error(error);
      return ResponseDto.ERROR(error.message);
    }
  }


  
}
