import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TourReservationRepository } from "./tourReservation.repository";
import { TourController } from "./tour.controller";
import { TourScheduleService } from "./tourSchedule.service";
import { SellerHolidayRepository } from "../seller/sellerHoliday.repository";
import { TourReservationService } from "./tourReservation.service";
import { SellerModule } from "../seller/seller.module";
import { TourRepository } from "./tour.repository";
import { TourService } from "./tour.service";


@Module({
    imports: [TypeOrmModule.forFeature([TourReservationRepository,SellerHolidayRepository,TourRepository]),SellerModule],
    controllers: [TourController],
    providers: [TourScheduleService,TourReservationService,TourService],
    exports: [TourScheduleService]
  })
  export class TourModule {}
  