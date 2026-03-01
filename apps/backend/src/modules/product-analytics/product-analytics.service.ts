import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product, ProductAnalytic } from '../../entities';
import { TrackProductEventDto } from './dto';

@Injectable()
export class ProductAnalyticsService {
  constructor(
    @InjectRepository(ProductAnalytic)
    private analyticRepository: Repository<ProductAnalytic>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async trackProductEvent(
    productId: string,
    trackProductEventDto: TrackProductEventDto,
    userId?: string,
  ) {
    // Verify product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Create analytic event entry
    const analytic = new ProductAnalytic();
    analytic.product_id = productId;
    if (userId) analytic.user_id = userId;
    analytic.event_type = trackProductEventDto.event_type as 'view' | 'click' | 'add_to_cart' | 'purchase';
    if (trackProductEventDto.referrer) analytic.referrer = trackProductEventDto.referrer;

    return await this.analyticRepository.save(analytic);
  }

  async getProductAnalytics(
    productId: string,
    eventType?: string,
    skip = 0,
    take = 100,
  ) {
    const where: any = { product_id: productId };
    if (eventType) {
      where.event_type = eventType;
    }

    const [events, total] = await this.analyticRepository.findAndCount({
      where,
      skip,
      take,
      order: { created_at: 'DESC' },
    });

    // Calculate metrics
    const allEvents = await this.analyticRepository.find({
      where: { product_id: productId },
    });

    const metrics = {
      total_events: allEvents.length,
      views: allEvents.filter(e => e.event_type === 'view').length,
      clicks: allEvents.filter(e => e.event_type === 'click').length,
      purchases: allEvents.filter(e => e.event_type === 'purchase').length,
      conversion_rate: (
        (allEvents.filter(e => e.event_type === 'purchase').length /
          allEvents.filter(e => e.event_type === 'view').length) *
        100
      ).toFixed(2),
    };

    return {
      product_id: productId,
      metrics,
      events,
      total,
    };
  }

  async getTopProducts(limit = 10, metric = 'purchases') {
    const products = await this.productRepository.find({
      where: { is_active: true },
      order: {
        [metric]: 'DESC',
      },
      take: limit,
    });

    return products;
  }

  async getProductPerformance(productId: string) {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const events = await this.analyticRepository.find({
      where: { product_id: productId },
    });

    const views = events.filter(e => e.event_type === 'view').length;
    const purchases = events.filter(e => e.event_type === 'purchase').length;
    const conversionRate = views > 0 ? ((purchases / views) * 100).toFixed(2) : '0.00';

    return {
      product_id: productId,
      product_name: product.name,
      total_views: views,
      total_purchases: purchases,
      conversion_rate: conversionRate,
      price: product.price,
      revenue: purchases * product.price,
    };
  }
}
