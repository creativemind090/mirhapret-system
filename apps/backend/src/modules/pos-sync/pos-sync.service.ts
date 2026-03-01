import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { POSSyncLog, Order, Product, ProductSizeInventory } from '../../entities';
import { PushSyncDto, ResolveSyncConflictDto } from './dto';

@Injectable()
export class POSSyncService {
  constructor(
    @InjectRepository(POSSyncLog)
    private syncLogRepository: Repository<POSSyncLog>,
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductSizeInventory)
    private inventoryRepository: Repository<ProductSizeInventory>,
  ) {}

  async pushSyncData(cashierId: string, pushSyncDto: PushSyncDto) {
    const syncLog = this.syncLogRepository.create({
      cashier_id: cashierId,
      sync_type: 'push',
      status: 'pending',
      data_pushed: pushSyncDto,
      pos_device_id: pushSyncDto.device_id,
    });

    try {
      // Process created orders
      for (const order of pushSyncDto.orders_created) {
        // This would merge with existing orders, handle duplicates
        const existingOrder = await this.orderRepository.findOne({
          where: { id: order.id },
        });

        if (existingOrder && existingOrder.updated_at > pushSyncDto.sync_timestamp) {
          // Conflict detected
          syncLog.status = 'conflict';
          syncLog.conflict_details = {
            order_id: order.id,
            backend_updated_at: existingOrder.updated_at,
            device_updated_at: pushSyncDto.sync_timestamp,
          };
          throw new ConflictException('Data conflict detected');
        }

        if (!existingOrder) {
          await this.orderRepository.save(order);
        }
      }

      // Process inventory changes
      for (const inv of pushSyncDto.inventory_changes) {
        await this.inventoryRepository.update(inv.id, {
          quantity: inv.quantity,
        });
      }

      syncLog.status = 'success';
      syncLog.synced_at = new Date();
    } catch (error) {
      syncLog.status = 'failed';
      syncLog.error_message = error.message;
    }

    const saved = await this.syncLogRepository.save(syncLog);
    return saved;
  }

  async pullSyncData(cashierId: string, deviceId: string, lastSyncTime: Date) {
    const syncLog = this.syncLogRepository.create({
      cashier_id: cashierId,
      sync_type: 'pull',
      status: 'pending',
      pos_device_id: deviceId,
    });

    try {
      // Get updated products since last sync
      const updatedProducts = await this.productRepository.find({
        where: lastSyncTime && lastSyncTime.getTime() > 0
          ? { updated_at: MoreThan(lastSyncTime) }
          : undefined,
        take: 1000, // Limit to prevent huge payloads
      });

      // Get updated inventory
      const updatedInventory = await this.inventoryRepository.find({
        where: lastSyncTime && lastSyncTime.getTime() > 0
          ? { updated_at: MoreThan(lastSyncTime) }
          : undefined,
        take: 1000,
      });

      syncLog.data_received = {
        products: updatedProducts,
        inventory: updatedInventory,
        last_sync: new Date(),
      };

      syncLog.status = 'success';
      syncLog.synced_at = new Date();
    } catch (error) {
      syncLog.status = 'failed';
      syncLog.error_message = error.message;
    }

    const saved = await this.syncLogRepository.save(syncLog);
    return saved;
  }

  async resolveSyncConflict(
    cashierId: string,
    resolveSyncConflictDto: ResolveSyncConflictDto,
  ) {
    const syncLog = await this.syncLogRepository.findOne({
      where: { id: resolveSyncConflictDto.sync_log_id, cashier_id: cashierId },
    });

    if (!syncLog) {
      throw new NotFoundException('Sync log not found');
    }

    if (syncLog.status !== 'conflict') {
      throw new BadRequestException('This sync is not in conflict state');
    }

    const conflictDetails = syncLog.conflict_details;

    // Apply resolution based on type
    if (resolveSyncConflictDto.resolution_type === 'backend_wins') {
      // Keep backend version (do nothing)
    } else if (resolveSyncConflictDto.resolution_type === 'device_wins') {
      // Overwrite with device data
      const deviceData = syncLog.data_pushed;
      const order = deviceData.orders_created.find(
        o => o.id === conflictDetails.order_id,
      );
      if (order) {
        await this.orderRepository.save(order);
      }
    } else if (resolveSyncConflictDto.resolution_type === 'manual_merge') {
      // Apply manually merged data
      await this.orderRepository.save(resolveSyncConflictDto.resolved_data);
    }

    syncLog.status = 'success';
    syncLog.synced_at = new Date();

    const saved = await this.syncLogRepository.save(syncLog);
    return saved;
  }

  async getSyncHistory(cashierId: string, skip = 0, take = 20) {
    const [logs, total] = await this.syncLogRepository.findAndCount({
      where: { cashier_id: cashierId },
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    return { logs, total };
  }

  async getPendingSyncs(cashierId: string) {
    const logs = await this.syncLogRepository.find({
      where: { cashier_id: cashierId, status: 'pending' },
    });

    return logs;
  }

  async getSyncStatus(syncLogId: string) {
    const log = await this.syncLogRepository.findOne({
      where: { id: syncLogId },
    });

    if (!log) {
      throw new NotFoundException('Sync log not found');
    }

    return log;
  }
}
