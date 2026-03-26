import { Injectable, NotFoundException, BadRequestException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Order, OrderItem, PaymentTransaction, Product, ProductSizeInventory } from '../../entities';
import { CreateOrderDto } from './dto';
import { InventoryService } from '../inventory/inventory.service';
import { EventsGateway } from '../events/events.gateway';
import { PromotionsService } from '../promotions/promotions.service';
import { EmailService } from '../email/email.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemsRepository: Repository<OrderItem>,
    @InjectRepository(PaymentTransaction)
    private paymentTransactionsRepository: Repository<PaymentTransaction>,
    @Inject(InventoryService)
    private inventoryService: InventoryService,
    private eventsGateway: EventsGateway,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private promotionsService: PromotionsService,
    private emailService: EmailService,
  ) {}

  async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
    // 8 alphanumeric chars = 36^8 ≈ 2.8 trillion combinations — no collision risk
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();
    return `ORD-${dateStr}-${random}`;
  }

  async findAll(filters?: {
    customer_id?: string;
    status?: string;
    payment_status?: string;
    source?: string;
    date_from?: string;
    order_number?: string;
    skip?: number;
    take?: number;
  }): Promise<{ data: Order[]; total: number }> {
    const query = this.ordersRepository.createQueryBuilder('order');

    if (filters?.customer_id) {
      query.andWhere('order.customer_id = :customer_id', { customer_id: filters.customer_id });
    }

    if (filters?.status) {
      query.andWhere('order.status = :status', { status: filters.status });
    }

    if (filters?.payment_status) {
      query.andWhere('order.payment_status = :payment_status', { payment_status: filters.payment_status });
    }

    if (filters?.source) {
      query.andWhere('order.source = :source', { source: filters.source });
    }

    if (filters?.date_from) {
      query.andWhere('order.created_at >= :date_from', { date_from: filters.date_from });
    }

    if (filters?.order_number) {
      query.andWhere('order.order_number = :order_number', { order_number: filters.order_number });
    }

    const total = await query.getCount();

    const skip = filters?.skip || 0;
    const take = filters?.take || 20;

    const data = await query
      .orderBy('order.created_at', 'DESC')
      .skip(skip)
      .take(take)
      .getMany();

    return { data, total };
  }

  async findById(id: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { id },
      relations: ['customer'],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  async findByOrderNumber(orderNumber: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { order_number: orderNumber },
      relations: ['customer'],
    });

    if (!order) {
      throw new NotFoundException(`Order ${orderNumber} not found`);
    }

    return order;
  }

  async findByOrderNumberAndEmail(orderNumber: string, email: string): Promise<Order> {
    const order = await this.ordersRepository.findOne({
      where: { order_number: orderNumber, customer_email: email },
    });

    if (!order) {
      throw new NotFoundException('No order found with that order number and email combination');
    }

    return order;
  }

  async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      const orderNumber = await this.generateOrderNumber();

      // Calculate totals
      const subtotal = createOrderDto.items.reduce((sum, item) => sum + (item.total || item.quantity * item.unit_price), 0);
      const taxAmount = createOrderDto.tax_amount || 0;
      const shippingAmount = createOrderDto.shipping_amount || 0;

      // Server-side promo code validation — never trust client-supplied discount_amount
      let discountAmount = 0;
      let validatedPromoCode: import('../../entities').PromoCode | null = null;
      if (createOrderDto.promo_code) {
        validatedPromoCode = await this.promotionsService.validatePromoCode(createOrderDto.promo_code);
        if (Number(validatedPromoCode.min_purchase_amount) > 0 && subtotal < Number(validatedPromoCode.min_purchase_amount)) {
          throw new BadRequestException(
            `Order subtotal does not meet the minimum purchase amount for this promo code`,
          );
        }
        if (validatedPromoCode.discount_type === 'percentage') {
          discountAmount = subtotal * (Number(validatedPromoCode.discount_value) / 100);
        } else {
          discountAmount = Number(validatedPromoCode.discount_value);
        }
        if (validatedPromoCode.max_discount_amount && discountAmount > Number(validatedPromoCode.max_discount_amount)) {
          discountAmount = Number(validatedPromoCode.max_discount_amount);
        }
        discountAmount = Math.min(discountAmount, subtotal);
      }
      // discount_amount from client is intentionally ignored — calculated entirely server-side

      const total = subtotal + taxAmount + shippingAmount - discountAmount;

      // Validate and reserve inventory for each item (only when inventory records exist)
      for (const item of createOrderDto.items) {
        const inventories = await this.inventoryService.getInventoryByProduct(item.product_id);

        // Skip inventory check if product has no inventory records (treat as unlimited stock)
        if (inventories.length === 0) continue;

        const sizeInventory = inventories.find((inv) => inv.size === item.product_size);

        if (!sizeInventory) {
          throw new BadRequestException(
            `Product size ${item.product_size} not available for product ${item.product_id}`,
          );
        }

        const available = sizeInventory.quantity - (sizeInventory.reserved_quantity || 0);
        if (available < item.quantity) {
          throw new BadRequestException(
            `Insufficient inventory for ${item.product_size}. Available: ${available}, Requested: ${item.quantity}`,
          );
        }

        // Fetch actual product price from DB to prevent price manipulation
        const product = await this.productRepository.findOne({ where: { id: item.product_id } });
        if (product && Math.abs(item.unit_price - Number(product.price)) > 0.01) {
          item.unit_price = Number(product.price);
        }

        // Reserve inventory
        await this.inventoryService.reserveInventory(sizeInventory.id, item.quantity);
      }

      const posAddress = { type: 'in_store', note: 'POS transaction — no shipping address' };
      const shippingAddr = createOrderDto.shipping_address ?? posAddress;
      const order = this.ordersRepository.create({
        order_number: orderNumber,
        customer_id: (createOrderDto.customer_id || undefined) as any,
        customer_email: createOrderDto.customer_email,
        customer_phone: createOrderDto.customer_phone,
        customer_first_name: createOrderDto.customer_first_name,
        customer_last_name: createOrderDto.customer_last_name || '',
        shipping_address: shippingAddr,
        billing_address: createOrderDto.billing_address ?? shippingAddr,
        shipping_same_as_billing: !createOrderDto.billing_address,
        source: (createOrderDto.source || 'online') as any,
        cashier_id: (createOrderDto.cashier_id || undefined) as any,
        // POS = in-store sale, immediately confirmed and paid
        status: createOrderDto.source === 'pos' ? 'confirmed' : 'pending',
        payment_status: createOrderDto.source === 'pos' ? 'paid' : 'pending',
        subtotal,
        tax_amount: taxAmount,
        shipping_amount: shippingAmount,
        discount_amount: discountAmount,
        total,
        payment_method: createOrderDto.payment_method,
        notes: createOrderDto.notes,
      } as any);

      const savedOrder = await this.ordersRepository.save(order);
      const savedOrderId = (savedOrder as any).id;

      // Record promo code usage and increment its counter
      if (validatedPromoCode) {
        await this.promotionsService.trackPromoCodeUsage(
          validatedPromoCode.id,
          savedOrderId,
          discountAmount,
          createOrderDto.customer_id,
        );
      }

      // Add order items + increment purchase_count + emit WS sale events
      if (createOrderDto.items && createOrderDto.items.length > 0) {
        await this.addOrderItems(savedOrderId, createOrderDto.items);
        for (const item of createOrderDto.items) {
          if (item.product_id) {
            await this.productRepository.increment({ id: item.product_id }, 'purchase_count', item.quantity ?? 1);
            this.eventsGateway.emitProductSale(item.product_id, item.quantity ?? 1);
          }
        }
      }

      // Send order confirmation email (fire-and-forget)
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mirhapret.com';
      const trackingUrl = `${siteUrl}/my-orders`;
      this.emailService
        .sendOrderConfirmation({
          to: createOrderDto.customer_email,
          firstName: createOrderDto.customer_first_name || 'Customer',
          orderNumber,
          items: (createOrderDto.items || []).map((item) => ({
            name: item.product_name || item.product_id,
            size: item.product_size || '',
            quantity: item.quantity,
            price: item.unit_price,
          })),
          subtotal,
          shipping: shippingAmount,
          discount: discountAmount,
          total,
          trackingUrl: createOrderDto.customer_id ? trackingUrl : `${siteUrl}/track?order=${orderNumber}&email=${encodeURIComponent(createOrderDto.customer_email)}`,
        })
        .catch(() => {}); // never block order creation on email failure

      return this.findById(savedOrderId);
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Failed to create order: ${error.message}`);
    }
  }

  async update(id: string, data: Partial<Order>): Promise<Order> {
    await this.findById(id);
    await this.ordersRepository.update(id, data);
    return this.findById(id);
  }

  async updateStatus(id: string, status: string, adminNotes?: string): Promise<Order> {
    await this.findById(id); // throws NotFoundException if not found

    // Validate status transition
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'];
    if (!validStatuses.includes(status)) {
      throw new BadRequestException(`Invalid status: ${status}`);
    }

    const updateData: any = { status };
    if (adminNotes) {
      updateData.admin_notes = adminNotes;
    }

    // If delivered, set completed_at
    if (status === 'delivered') {
      updateData.completed_at = new Date();
    }

    await this.ordersRepository.update(id, updateData);
    return this.findById(id);
  }

  async updateTracking(id: string, trackingNumber: string): Promise<Order> {
    await this.findById(id);
    await this.ordersRepository.update(id, { tracking_number: trackingNumber });
    return this.findById(id);
  }

  async bookPostEx(id: string): Promise<{ trackingNumber: string }> {
    const order = await this.findById(id);
    const items = await this.getOrderItems(id);

    const POSTEX_TOKEN = 'YzMyNWYzY2FjNjJkNGZiNjllOWQ3YWE4YzFlMzVmMTI6N2ViMDkwNTQ1ZjhhNDZhM2IwNGZiNWMwNTRhMTQ1NGM=';
    const POSTEX_BASE = 'https://api.postex.pk/services/integration/api';
    const headers = { 'Content-Type': 'application/json', token: POSTEX_TOKEN };

    // Step 1: Fetch merchant pickup address code
    const addrRes = await fetch(`${POSTEX_BASE}/order/v1/get-merchant-address`, { headers });
    const addrData = await addrRes.json() as any;
    const pickupAddressCode: string =
      addrData?.dist?.[0]?.addressCode ??
      addrData?.dist?.addressCode ??
      addrData?.dist?.[0]?.pickupAddressCode ??
      '';

    // Step 2: Build payload
    const addr = (order as any).shipping_address ?? {};
    const city: string = addr.city || 'Lahore';
    const deliveryAddress = [addr.street_address, addr.city, addr.province, addr.country]
      .filter(Boolean).join(', ');
    const customerName = `${(order as any).customer_first_name ?? ''} ${(order as any).customer_last_name ?? ''}`.trim() || 'Customer';
    const customerPhone: string = (order as any).customer_phone || addr.phone || '03000000000';
    const itemsCount = items.reduce((s, i) => s + ((i as any).quantity || 1), 0);
    const orderTotal = Number(order.total ?? 0);

    const payload = {
      cityName: city,
      customerName,
      customerPhone,
      deliveryAddress,
      invoiceDivision: 1,
      invoicePayment: orderTotal,
      items: itemsCount || 1,
      orderDetail: items.map((i: any) => `${i.product_name} x${i.quantity}`).join(', ') || 'Fashion Item',
      orderRefNumber: order.order_number,
      orderType: 'Normal',
      transactionNotes: `MirhaPret Order ${order.order_number}`,
      pickupAddressCode,
    };

    // Step 3: Create order on PostEx
    const res = await fetch(`${POSTEX_BASE}/order/v3/create-order`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json() as any;

    if (!res.ok || !data?.dist?.trackingNumber) {
      const msg = data?.dist?.message || data?.message || `PostEx API error ${res.status}`;
      throw new BadRequestException(msg);
    }

    const trackingNumber: string = data.dist.trackingNumber;
    await this.ordersRepository.update(id, { tracking_number: trackingNumber });
    return { trackingNumber };
  }

  async trackPostExOrder(id: string): Promise<any> {
    const order = await this.findById(id);
    if (!(order as any).tracking_number) {
      throw new BadRequestException('No tracking number available for this order yet');
    }

    const POSTEX_TOKEN = 'YzMyNWYzY2FjNjJkNGZiNjllOWQ3YWE4YzFlMzVmMTI6N2ViMDkwNTQ1ZjhhNDZhM2IwNGZiNWMwNTRhMTQ1NGM=';
    const POSTEX_BASE = 'https://api.postex.pk/services/integration/api';
    const headers = { 'Content-Type': 'application/json', token: POSTEX_TOKEN };

    const res = await fetch(`${POSTEX_BASE}/order/v1/track-order/${(order as any).tracking_number}`, { headers });
    const data = await res.json() as any;

    return {
      tracking_number: (order as any).tracking_number,
      order_number: (order as any).order_number,
      postex_data: data?.dist ?? null,
    };
  }

  async createExchangeOrder(id: string, exchangeData: { reason: string; items?: string }): Promise<{ exchangeTrackingNumber: string }> {
    const order = await this.findById(id);

    if (['cancelled', 'refunded'].includes(order.status)) {
      throw new BadRequestException(`Cannot create exchange for order with status: ${order.status}`);
    }

    const POSTEX_TOKEN = 'YzMyNWYzY2FjNjJkNGZiNjllOWQ3YWE4YzFlMzVmMTI6N2ViMDkwNTQ1ZjhhNDZhM2IwNGZiNWMwNTRhMTQ1NGM=';
    const POSTEX_BASE = 'https://api.postex.pk/services/integration/api';
    const headers = { 'Content-Type': 'application/json', token: POSTEX_TOKEN };

    const addrRes = await fetch(`${POSTEX_BASE}/order/v1/get-merchant-address`, { headers });
    const addrData = await addrRes.json() as any;
    const pickupAddressCode: string = addrData?.dist?.[0]?.addressCode ?? addrData?.dist?.addressCode ?? '';

    const addr = (order as any).shipping_address ?? {};
    const customerName = `${(order as any).customer_first_name ?? ''} ${(order as any).customer_last_name ?? ''}`.trim() || 'Customer';
    const deliveryAddress = [addr.street_address, addr.city, addr.province].filter(Boolean).join(', ');

    const payload = {
      cityName: addr.city || 'Lahore',
      customerName,
      customerPhone: (order as any).customer_phone || '03000000000',
      deliveryAddress,
      invoiceDivision: 1,
      invoicePayment: 0,
      items: 1,
      orderDetail: `Exchange for Order ${(order as any).order_number}. Reason: ${exchangeData.reason}. Items: ${exchangeData.items || 'As requested'}`,
      orderRefNumber: `EXC-${(order as any).order_number}`,
      orderType: 'Replacement',
      transactionNotes: exchangeData.reason,
      pickupAddressCode,
    };

    const res = await fetch(`${POSTEX_BASE}/order/v3/create-order`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });

    const data = await res.json() as any;

    if (!res.ok || !data?.dist?.trackingNumber) {
      const msg = data?.dist?.message || data?.message || `PostEx exchange booking failed`;
      throw new BadRequestException(msg);
    }

    const exchangeTrackingNumber: string = data.dist.trackingNumber;
    await this.ordersRepository.update(id, {
      admin_notes: `Exchange requested: ${exchangeData.reason}. Exchange tracking: ${exchangeTrackingNumber}`,
    } as any);

    return { exchangeTrackingNumber };
  }

  async cancel(id: string): Promise<Order> {
    try {
      const order = await this.findById(id);

      if (['delivered', 'cancelled', 'refunded'].includes(order.status)) {
        throw new BadRequestException(`Cannot cancel order with status: ${order.status}`);
      }

      // Release reserved inventory — single query for all product IDs, then match in memory
      const orderItems = await this.getOrderItems(id);
      const productIds = [...new Set(orderItems.map((i) => i.product_id as any as string))];
      const allInventories = productIds.length
        ? await this.ordersRepository.manager.find(ProductSizeInventory, {
            where: { product_id: In(productIds) as any },
          })
        : [];

      for (const item of orderItems) {
        const sizeInventory = allInventories.find(
          (inv: ProductSizeInventory) => (inv.product_id as any) === item.product_id && inv.size === item.product_size,
        );
        if (sizeInventory) {
          await this.inventoryService.releaseReservedInventory(sizeInventory.id, item.quantity);
        }
      }

      return this.updateStatus(id, 'cancelled');
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      throw new BadRequestException(`Failed to cancel order: ${error.message}`);
    }
  }

  async addOrderItems(orderId: string, items: any[]): Promise<OrderItem[]> {
    const orderItems = items.map((item) => {
      const orderItem = new OrderItem();
      orderItem.order_id = orderId as any;
      orderItem.product_id = item.product_id as any;
      orderItem.product_name = item.product_name || '';
      orderItem.sku = item.sku || '';
      orderItem.product_size = item.product_size || '';
      orderItem.quantity = item.quantity || 1;
      orderItem.unit_price = item.unit_price || 0;
      orderItem.total = item.total || item.quantity * item.unit_price;
      return orderItem;
    });

    return this.orderItemsRepository.save(orderItems);
  }

  async createPaymentTransaction(
    orderId: string,
    data: Partial<PaymentTransaction>,
  ): Promise<PaymentTransaction> {
    const transaction = this.paymentTransactionsRepository.create({
      order_id: orderId as any,
      ...data,
    });

    return this.paymentTransactionsRepository.save(transaction);
  }

  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    return this.orderItemsRepository.find({
      where: { order_id: orderId as any },
    });
  }
}
