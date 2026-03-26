import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductSizeInventory } from '../../entities';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(ProductSizeInventory)
    private inventoryRepository: Repository<ProductSizeInventory>,
  ) {}

  async getInventoryByProduct(
    productId: string,
    storeId?: string,
  ): Promise<ProductSizeInventory[]> {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.product_id = :productId', { productId });

    if (storeId) {
      query.andWhere('inventory.store_id = :storeId', { storeId });
    } else {
      query.andWhere('inventory.store_id IS NULL');
    }

    return query.getMany();
  }

  async getInventoryBySize(
    productId: string,
    size: string,
    storeId?: string,
  ): Promise<ProductSizeInventory | null> {
    const query = this.inventoryRepository
      .createQueryBuilder('inventory')
      .where('inventory.product_id = :productId', { productId })
      .andWhere('inventory.size = :size', { size });

    if (storeId) {
      query.andWhere('inventory.store_id = :storeId', { storeId });
    } else {
      query.andWhere('inventory.store_id IS NULL');
    }

    return (await query.getOne()) || null;
  }

  async updateInventory(
    id: string,
    quantity: number,
  ): Promise<ProductSizeInventory> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    await this.inventoryRepository.update(id, { quantity });
    const updated = await this.inventoryRepository.findOne({ where: { id } });
    return updated!;
  }

  async reserveInventory(
    id: string,
    quantity: number,
  ): Promise<ProductSizeInventory> {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    return this.inventoryRepository.manager.transaction(async (manager) => {
      // Pessimistic write lock: only one transaction can hold this lock at a time,
      // preventing concurrent reads from both passing the availability check (race condition / over-selling).
      const inventory = await manager
        .createQueryBuilder(ProductSizeInventory, 'inv')
        .where('inv.id = :id', { id })
        .setLock('pessimistic_write')
        .getOne();

      if (!inventory) {
        throw new NotFoundException(`Inventory with ID ${id} not found`);
      }

      const available = inventory.quantity - (inventory.reserved_quantity || 0);
      if (available < quantity) {
        throw new BadRequestException(
          `Insufficient inventory: requested ${quantity}, available ${available}`,
        );
      }

      await manager.update(ProductSizeInventory, id, {
        reserved_quantity: () => `reserved_quantity + ${quantity}`,
      });

      const updated = await manager.findOne(ProductSizeInventory, { where: { id } });
      return updated!;
    });
  }

  async releaseReservedInventory(
    id: string,
    quantity: number,
  ): Promise<ProductSizeInventory> {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new BadRequestException('Quantity must be a positive integer');
    }

    return this.inventoryRepository.manager.transaction(async (manager) => {
      // Pessimistic write lock prevents concurrent cancellations from double-releasing
      const inventory = await manager
        .createQueryBuilder(ProductSizeInventory, 'inv')
        .where('inv.id = :id', { id })
        .setLock('pessimistic_write')
        .getOne();

      if (!inventory) {
        throw new NotFoundException(`Inventory with ID ${id} not found`);
      }

      await manager.update(ProductSizeInventory, id, {
        reserved_quantity: () => `GREATEST(0, reserved_quantity - ${quantity})`,
      });

      const updated = await manager.findOne(ProductSizeInventory, { where: { id } });
      return updated!;
    });
  }

  async getAvailableQuantity(id: string): Promise<number> {
    const inventory = await this.inventoryRepository.findOne({
      where: { id },
    });

    if (!inventory) {
      throw new NotFoundException(`Inventory with ID ${id} not found`);
    }

    return inventory.quantity - (inventory.reserved_quantity || 0);
  }

  async setProductQuantity(
    productId: string,
    quantity: number,
    sizes: string[],
  ): Promise<ProductSizeInventory[]> {
    const results: ProductSizeInventory[] = [];
    for (const size of sizes) {
      const existing = await this.inventoryRepository.findOne({
        where: { product_id: productId, size, store_id: null as any },
      });
      if (existing) {
        await this.inventoryRepository.update(existing.id, { quantity });
        results.push((await this.inventoryRepository.findOne({ where: { id: existing.id } }))!);
      } else {
        const row = this.inventoryRepository.create({
          product_id: productId,
          size,
          quantity,
          reserved_quantity: 0,
        });
        results.push(await this.inventoryRepository.save(row));
      }
    }
    return results;
  }
}
