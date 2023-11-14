import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { SellerHolidayRepository } from "../seller/sellerHoliday.repository";
import * as moment from 'moment';
import { CreateReservationDto } from "src/dtos/createReservation.dto";
import { v4 as uuidv4 } from 'uuid';
import { TourReservationRepository } from "./tourReservation.repository";
import { TourReservation } from "src/entities/tourReservation.entity";
import { UUID } from "vue-uuid";
import { TourRepository } from "./tour.repository";
import { In } from "typeorm";

@Injectable()
export class TourReservationService {
  constructor(
    private readonly sellerHolidayRepository: SellerHolidayRepository,
    private readonly tourReservationRepository:TourReservationRepository,
    private readonly tourRepository:TourRepository

  ) {}

  async createReservation(tourId: number, createReservationDto: CreateReservationDto): Promise<any> {

    const { customerId,sellerId, date } = createReservationDto;

    // 입력된 예약 날짜가 유효한지 검사합니다.
    if (!moment(date).isSameOrAfter(moment().startOf('day'))) {
        throw new ForbiddenException('예약 날짜가 유효하지 않습니다.');
    }

    // 날짜가 주간 휴일이나 특정 휴일인지 확인합니다.
    const reservationDay = moment(date);
    const dayOfWeek = reservationDay.isoWeekday(); // isoWeekday는 1 (월요일)부터 7 (일요일)까지의 값을 반환합니다.


    // 주간 휴일을 확인합니다.
    const weeklyHoliday = await this.sellerHolidayRepository.findOne({
        where: {
          sellerId: sellerId,
          weeklyHoliday: dayOfWeek,
        },
      });
  
    // 특정 휴일을 확인합니다.
    const specificHoliday = await this.sellerHolidayRepository.findOne({
        where: {
          sellerId: sellerId,
          specificHoliday: reservationDay.format('YYYY-MM-DD'), // 날짜 형식을 맞춥니다.
        },
    });
  
    if (weeklyHoliday || specificHoliday) {
      throw new ForbiddenException('선택하신 날짜는 판매자의 휴일입니다.');
    }


    // 해당 날짜에 대한 예약 수와 일일 예약 한도를 확인합니다.
    const reservationDayFormatted = reservationDay.format('YYYY-MM-DD');
    const [count, tour] = await Promise.all([
      this.tourReservationRepository.count({
        where: { tourId: tourId, date: reservationDayFormatted , status: In(['approved'])},
      }),
      this.tourRepository.findOne({ where: { id: tourId } })
    ]);

    if (!tour) {
      throw new NotFoundException('해당 투어를 찾을 수 없습니다.');
    }

    // 예약 상태를 결정 - 예약 한도 이하면 'approved', 초과하면 'pending'
    const status = count < tour.reservationLimit ? 'approved' : 'pending';


    // 예약 토큰 생성
    const reservationToken = uuidv4();
    
    // 예약 엔티티를 생성하고 데이터베이스에 저장합니다.
    const reservation = this.tourReservationRepository.create({
      customerId,
      tourId,
      sellerId,
      date: reservationDay.toDate(),
      token: reservationToken,
      status, 
    });


    return  await this.tourReservationRepository.save(reservation);


  }

  async cancelReservation(reservationId: number): Promise<boolean> {
    // 예약 정보 확인
    const reservation = await this.tourReservationRepository.findOne({ where: { id: reservationId } });

    if (!reservation) {
      throw new NotFoundException(`Reservation with ID ${reservationId} not found.`);
    }

    // 여행 출발 3일 전인지 확인
    const reservationDate = moment(reservation.date);
    const threeDaysBeforeReservation = reservationDate.clone().subtract(3, 'days');

    if (moment().isAfter(threeDaysBeforeReservation)) {
      throw new ForbiddenException('예약은 3일 이전에 취소가능합니다.');
    }

    // 예약 상태를 'cancelled'로 변경
    reservation.status = 'cancelled';
    await this.tourReservationRepository.save(reservation);
    return true;
  }

  async findPendingReservations(sellerId: number): Promise<TourReservation[]> {
    return this.tourReservationRepository.find({
      where: {
        sellerId: sellerId,
        status: 'pending',
      },
    });
  }


  async approveTourReservation(tourReservationId: number): Promise<void> {
    const tourReservation = await this.tourReservationRepository.findOne({
        id:tourReservationId
    });

    if (!tourReservation) {
      throw new NotFoundException('Tour reservation not found');
    }

    if (tourReservation.status === 'approved') {
      throw new ForbiddenException('Tour reservation already approved');
    }

    tourReservation.status = 'approved';
    await this.tourReservationRepository.save(tourReservation);
  }


  async checkReservation(token: UUID): Promise<TourReservation> {
    // 토큰을 이용해 예약을 조회
    const reservation = await this.tourReservationRepository.findOne({
      where: {token},
    });

    if (!reservation) {
      throw new NotFoundException('예약을 찾을 수 없습니다.');
    }

    if (reservation.tokenStatus === 'used') {
      throw new ForbiddenException('This token has already been used.');
    }

    return reservation;
  }

  async updateTourParticipationStatus( token: UUID): Promise<TourReservation> {
    // 토큰을 이용해 참여 정보를 조회
    const reservation = await this.tourReservationRepository.findOne({
      where: {token},
    });

    if (!reservation) {
      throw new NotFoundException('예약을 찾을 수 없습니다.');
    }

    if (reservation.tokenStatus === 'used') {
      throw new ForbiddenException('This token has already been used.');
    }


    reservation.status = 'participated';
    reservation.tokenStatus = 'used';

    return await this.tourReservationRepository.save(reservation);

    }



}



