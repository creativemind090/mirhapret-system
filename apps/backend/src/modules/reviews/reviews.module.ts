import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductReview, Product, Order, OrderItem } from '../../entities';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';

@Module({
  imports: [TypeOrmModule.forFeature([ProductReview, Product, Order, OrderItem])],
  providers: [ReviewsService],
  controllers: [ReviewsController],
  exports: [ReviewsService],
})
export class ReviewsModule {}
