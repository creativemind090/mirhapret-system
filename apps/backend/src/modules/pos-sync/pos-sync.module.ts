import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { POSSyncLog, Order, Product, ProductSizeInventory } from '../../entities';
import { POSSyncService } from './pos-sync.service';
import { POSSyncController } from './pos-sync.controller';

@Module({
  imports: [TypeOrmModule.forFeature([POSSyncLog, Order, Product, ProductSizeInventory])],
  providers: [POSSyncService],
  controllers: [POSSyncController],
  exports: [POSSyncService],
})
export class POSSyncModule {}
