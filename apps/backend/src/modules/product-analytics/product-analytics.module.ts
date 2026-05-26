import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAnalytic, Product } from '../../entities';
import { ProductAnalyticsService } from './product-analytics.service';
import { ProductAnalyticsController } from './product-analytics.controller';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAnalytic, Product]), EventsModule],
  providers: [ProductAnalyticsService],
  controllers: [ProductAnalyticsController],
  exports: [ProductAnalyticsService],
})
export class ProductAnalyticsModule {}
