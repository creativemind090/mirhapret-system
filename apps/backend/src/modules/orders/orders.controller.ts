import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllOrders(
    @CurrentUser() currentUser: any,
    @Query('customer_id') customer_id?: string,
    @Query('status') status?: string,
    @Query('payment_status') payment_status?: string,
    @Query('source') source?: string,
    @Query('date_from') date_from?: string,
    @Query('order_number') order_number?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    // Customers can only view their own orders
    if (currentUser.role === 'customer' && customer_id && customer_id !== currentUser.id) {
      throw new ForbiddenException('Access denied');
    }
    // If customer and no customer_id filter, auto-set to their own
    const effectiveCustomerId = currentUser.role === 'customer'
      ? (customer_id || currentUser.id)
      : customer_id;

    const filters = {
      customer_id: effectiveCustomerId,
      status,
      payment_status,
      source,
      date_from,
      order_number,
      skip: skip ? parseInt(skip) : 0,
      take: take ? parseInt(take) : 20,
    };

    const result = await this.ordersService.findAll(filters);
    return {
      message: 'Orders retrieved successfully',
      data: result.data,
      pagination: {
        total: result.total,
        skip: filters.skip,
        take: filters.take,
      },
    };
  }

  @Get('track/guest')
  @Public()
  async trackGuestOrder(
    @Query('order_number') orderNumber: string,
    @Query('email') email: string,
  ) {
    if (!orderNumber || !email) {
      throw new (await import('@nestjs/common').then(m => m.BadRequestException))('order_number and email are required');
    }
    const order = await this.ordersService.findByOrderNumberAndEmail(orderNumber, email);
    const items = await this.ordersService.getOrderItems(order.id);
    return {
      message: 'Order found',
      data: { ...order, items },
    };
  }

  @Get(':id')
  async getOrderById(@Param('id') id: string) {
    const order = await this.ordersService.findById(id);
    const items = await this.ordersService.getOrderItems(id);
    return {
      message: 'Order retrieved successfully',
      data: {
        ...order,
        items,
      },
    };
  }

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    const order = await this.ordersService.create(createOrderDto);
    return {
      message: 'Order created successfully',
      data: order,
    };
  }

  @Put(':id/status')
  @UseGuards(JwtAuthGuard)
  async updateOrderStatus(
    @Param('id') id: string,
    @Body() updateOrderStatusDto: UpdateOrderStatusDto,
  ) {
    const order = await this.ordersService.updateStatus(
      id,
      updateOrderStatusDto.status,
      updateOrderStatusDto.admin_notes,
    );
    return {
      message: 'Order status updated successfully',
      data: order,
    };
  }

  @Put(':id/tracking')
  @UseGuards(JwtAuthGuard)
  async updateTracking(
    @Param('id') id: string,
    @Body('tracking_number') trackingNumber: string,
  ) {
    const order = await this.ordersService.updateTracking(id, trackingNumber);
    return { message: 'Tracking number updated successfully', data: order };
  }

  @Post(':id/book-courier')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async bookCourier(@Param('id') id: string) {
    const result = await this.ordersService.bookPostEx(id);
    return { message: 'Shipment booked successfully', data: result };
  }

  @Post(':id/cancel')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async cancelOrder(@Param('id') id: string) {
    const order = await this.ordersService.cancel(id);
    return {
      message: 'Order cancelled successfully',
      data: order,
    };
  }

  @Get(':id/postex-tracking')
  @UseGuards(JwtAuthGuard)
  async getPostExTracking(@Param('id') id: string, @CurrentUser() currentUser: any) {
    const order = await this.ordersService.findById(id);
    if (currentUser.role === 'customer' && (order as any).customer_id !== currentUser.id) {
      throw new ForbiddenException('Access denied');
    }
    const tracking = await this.ordersService.trackPostExOrder(id);
    return { message: 'Tracking retrieved successfully', data: tracking };
  }

  @Post(':id/exchange')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async createExchange(
    @Param('id') id: string,
    @Body() body: { reason: string; items?: string },
    @CurrentUser() currentUser: any,
  ) {
    const order = await this.ordersService.findById(id);
    if (currentUser.role === 'customer' && (order as any).customer_id !== currentUser.id) {
      throw new ForbiddenException('Access denied');
    }
    const result = await this.ordersService.createExchangeOrder(id, body);
    return { message: 'Exchange request submitted successfully', data: result };
  }
}
