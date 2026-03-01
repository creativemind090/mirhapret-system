import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProductAnalyticsService } from './product-analytics.service';
import { TrackProductEventDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('products/analytics')
export class ProductAnalyticsController {
  constructor(private productAnalyticsService: ProductAnalyticsService) {}

  @Post(':id/track')
  @HttpCode(HttpStatus.CREATED)
  async trackProductEvent(
    @Param('id') productId: string,
    @Body() trackProductEventDto: TrackProductEventDto,
    @CurrentUser() user?: any,
  ) {
    const result = await this.productAnalyticsService.trackProductEvent(
      productId,
      trackProductEventDto,
      user?.id,
    );
    return {
      message: 'Product event tracked',
      data: result,
    };
  }

  @Get(':id/analytics')
  async getProductAnalytics(
    @Param('id') productId: string,
    @Query('eventType') eventType?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const result = await this.productAnalyticsService.getProductAnalytics(
      productId,
      eventType,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 100,
    );
    return {
      message: 'Product analytics retrieved',
      data: result,
    };
  }

  @Get(':id/performance')
  async getProductPerformance(@Param('id') productId: string) {
    const performance = await this.productAnalyticsService.getProductPerformance(productId);
    return {
      message: 'Product performance retrieved',
      data: performance,
    };
  }

  @Get('admin/top-products')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super_admin')
  async getTopProducts(
    @Query('limit') limit?: string,
    @Query('metric') metric: string = 'purchases',
  ) {
    const products = await this.productAnalyticsService.getTopProducts(
      limit ? parseInt(limit) : 10,
      metric,
    );
    return {
      message: 'Top products retrieved',
      data: products,
    };
  }
}
