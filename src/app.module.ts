import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from './config';
import { RedisModule, RedisModuleOptions } from '@nestjs-modules/ioredis';
import { TourModule } from './modules/tour/tour.module';
import { SellerModule } from './modules/seller/seller.module';


@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: configService.get('DB_PORT'),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + './../**/**.entity{.ts,.js}'],
          migrations: [__dirname + '/migrations/*{.ts,.js}'],
          synchronize:true,
          migrationsRun: true,
          logging: "all"
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          config:{
            url: configService.get('REDIS_ENDPOINT'),
          }
      }}
    }),
    ConfigModule,
    TourModule,
    SellerModule
  ]
})
export class AppModule {}
