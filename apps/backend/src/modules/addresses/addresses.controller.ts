import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto, UpdateAddressDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private addressesService: AddressesService) {}

  @Get()
  async getAddresses(@CurrentUser() user: any) {
    const addresses = await this.addressesService.getAddresses(user.id);
    return {
      message: 'Addresses retrieved successfully',
      data: addresses,
    };
  }

  @Get('default')
  async getDefaultAddress(@CurrentUser() user: any) {
    const address = await this.addressesService.getDefaultAddress(user.id);
    return {
      message: 'Default address retrieved',
      data: address,
    };
  }

  @Get(':id')
  async getAddressById(@CurrentUser() user: any, @Param('id') id: string) {
    const address = await this.addressesService.getAddressById(user.id, id);
    return {
      message: 'Address retrieved successfully',
      data: address,
    };
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createAddress(
    @CurrentUser() user: any,
    @Body() createAddressDto: CreateAddressDto,
  ) {
    const address = await this.addressesService.createAddress(
      user.id,
      createAddressDto,
    );
    return {
      message: 'Address created successfully',
      data: address,
    };
  }

  @Put(':id')
  async updateAddress(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateAddressDto: UpdateAddressDto,
  ) {
    const address = await this.addressesService.updateAddress(
      user.id,
      id,
      updateAddressDto,
    );
    return {
      message: 'Address updated successfully',
      data: address,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteAddress(@CurrentUser() user: any, @Param('id') id: string) {
    const result = await this.addressesService.deleteAddress(user.id, id);
    return result;
  }

  @Put(':id/set-default')
  async setDefaultAddress(@CurrentUser() user: any, @Param('id') id: string) {
    const address = await this.addressesService.setDefaultAddress(user.id, id);
    return {
      message: 'Address set as default',
      data: address,
    };
  }
}
