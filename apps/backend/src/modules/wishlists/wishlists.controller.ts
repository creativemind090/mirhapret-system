import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('wishlists')
@UseGuards(JwtAuthGuard)
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Get()
  async getWishlist(
    @CurrentUser() user: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const result = await this.wishlistsService.getWishlist(
      user.id,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
    return {
      message: 'Wishlist retrieved successfully',
      data: result.items,
      total: result.total,
    };
  }

  @Post(':productId')
  @HttpCode(HttpStatus.CREATED)
  async addToWishlist(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    const result = await this.wishlistsService.addToWishlist(user.id, productId);
    return {
      message: 'Added to wishlist',
      data: result,
    };
  }

  @Delete(':productId')
  @HttpCode(HttpStatus.OK)
  async removeFromWishlist(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    const result = await this.wishlistsService.removeFromWishlist(
      user.id,
      productId,
    );
    return result;
  }

  @Get(':productId/check')
  async checkInWishlist(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    const result = await this.wishlistsService.checkInWishlist(user.id, productId);
    return {
      message: 'Check completed',
      data: result,
    };
  }

  @Get('count/total')
  async getWishlistCount(@CurrentUser() user: any) {
    const result = await this.wishlistsService.getWishlistCount(user.id);
    return {
      message: 'Wishlist count retrieved',
      data: result,
    };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async clearWishlist(@CurrentUser() user: any) {
    const result = await this.wishlistsService.clearWishlist(user.id);
    return result;
  }
}
