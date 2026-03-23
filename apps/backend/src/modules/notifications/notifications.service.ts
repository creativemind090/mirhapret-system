import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../../entities/order.entity';
import { ProductSizeInventory } from '../../entities/product-size-inventory.entity';

const LOW_STOCK_THRESHOLD = 15;

export interface AdminNotification {
  id: string;
  type: 'order' | 'low_stock';
  title: string;
  body: string;
  time: string;
  meta: Record<string, any>;
}

@Injectable()
export class NotificationsService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @InjectRepository(ProductSizeInventory)
    private readonly inventoryRepo: Repository<ProductSizeInventory>,
  ) {}

  async getAdminNotifications(): Promise<AdminNotification[]> {
    const [orderNotifs, stockNotifs] = await Promise.all([
      this.getRecentOrderNotifications(),
      this.getLowStockNotifications(),
    ]);

    const all = [...orderNotifs, ...stockNotifs];

    // Sort by time descending
    all.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime());

    return all;
  }

  private async getRecentOrderNotifications(): Promise<AdminNotification[]> {
    const since = new Date();
    since.setDate(since.getDate() - 7);

    const orders = await this.orderRepo.find({
      where: {},
      order: { created_at: 'DESC' },
      take: 10,
    });

    return orders.map((o) => {
      const customerName =
        o.customer_first_name && o.customer_last_name
          ? `${o.customer_first_name} ${o.customer_last_name}`
          : o.customer_email ?? 'Customer';

      return {
        id: `order-${o.id}`,
        type: 'order' as const,
        title: `New Order — ${o.order_number}`,
        body: `${customerName} · PKR ${Number(o.total).toLocaleString()} · ${o.status}`,
        time: o.created_at.toISOString(),
        meta: {
          order_id: o.id,
          order_number: o.order_number,
          status: o.status,
          total: o.total,
        },
      };
    });
  }

  private async getLowStockNotifications(): Promise<AdminNotification[]> {
    const lowStockItems = await this.inventoryRepo
      .createQueryBuilder('inv')
      .leftJoinAndSelect('inv.product', 'product')
      .where('(inv.quantity - inv.reserved_quantity) <= :threshold', {
        threshold: LOW_STOCK_THRESHOLD,
      })
      .andWhere('product.is_active = true')
      .orderBy('inv.quantity', 'ASC')
      .take(20)
      .getMany();

    return lowStockItems.map((inv) => {
      const available = inv.quantity - inv.reserved_quantity;
      const productName = (inv as any).product?.name ?? 'Unknown Product';

      return {
        id: `stock-${inv.id}`,
        type: 'low_stock' as const,
        title: `Low Stock: ${productName} (${inv.size})`,
        body:
          available <= 0
            ? 'Out of stock — restock needed'
            : `Only ${available} unit${available === 1 ? '' : 's'} remaining`,
        time: new Date().toISOString(),
        meta: {
          inventory_id: inv.id,
          product_id: inv.product_id,
          size: inv.size,
          quantity: inv.quantity,
          reserved: inv.reserved_quantity,
          available,
        },
      };
    });
  }
}
