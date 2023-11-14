import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TourReservationRepository } from "../tour/tourReservation.repository";
import { SellerHolidayRepository } from "../seller/sellerHoliday.repository";
import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.service";



@Module({
    imports: [TypeOrmModule.forFeature([TourReservationRepository,SellerHolidayRepository])],
    controllers: [SellerController],
    providers: [SellerService],
    exports: [SellerService]
  })
  export class SellerModule {}
  