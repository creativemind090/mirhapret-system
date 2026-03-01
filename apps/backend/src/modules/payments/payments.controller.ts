import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto, ConfirmPaymentDto, CreatePaymentMethodDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('payments')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private paymentsService: PaymentsService) {}

  @Post('initiate')
  @HttpCode(HttpStatus.CREATED)
  async initiatePayment(
    @CurrentUser() user: any,
    @Body() initiatePaymentDto: InitiatePaymentDto,
  ) {
    const payment = await this.paymentsService.initiatePayment(user.id, initiatePaymentDto);
    return {
      message: 'Payment initiated successfully',
      data: payment,
    };
  }

  @Post('confirm')
  @HttpCode(HttpStatus.OK)
  async confirmPayment(
    @CurrentUser() user: any,
    @Body() confirmPaymentDto: ConfirmPaymentDto,
  ) {
    const payment = await this.paymentsService.confirmPayment(user.id, confirmPaymentDto);
    return {
      message: 'Payment confirmed successfully',
      data: payment,
    };
  }

  @Get('history')
  async getPaymentHistory(
    @CurrentUser() user: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const result = await this.paymentsService.getPaymentHistory(
      user.id,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
    return {
      message: 'Payment history retrieved',
      data: result.payments,
      total: result.total,
    };
  }

  @Get(':id')
  async getPaymentStatus(@Param('id') id: string) {
    const payment = await this.paymentsService.getPaymentStatus(id);
    return {
      message: 'Payment status retrieved',
      data: payment,
    };
  }

  @Post(':id/refund')
  async refundPayment(@Param('id') id: string, @Body('reason') reason: string) {
    const payment = await this.paymentsService.refundPayment(id, reason);
    return {
      message: 'Refund processed successfully',
      data: payment,
    };
  }

  // Payment Methods
  @Get('methods/list')
  async getPaymentMethods(@CurrentUser() user: any) {
    const methods = await this.paymentsService.getPaymentMethods(user.id);
    return {
      message: 'Payment methods retrieved',
      data: methods,
    };
  }

  @Post('methods/create')
  @HttpCode(HttpStatus.CREATED)
  async createPaymentMethod(
    @CurrentUser() user: any,
    @Body() createPaymentMethodDto: CreatePaymentMethodDto,
  ) {
    const method = await this.paymentsService.createPaymentMethod(user.id, createPaymentMethodDto);
    return {
      message: 'Payment method added successfully',
      data: method,
    };
  }

  @Delete('methods/:id')
  async deletePaymentMethod(@CurrentUser() user: any, @Param('id') id: string) {
    const result = await this.paymentsService.deletePaymentMethod(user.id, id);
    return result;
  }
}
