import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from '../../entities/order.entity';
import { ProductSizeInventory } from '../../entities/product-size-inventory.entity';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Order, ProductSizeInventory])],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule {}
