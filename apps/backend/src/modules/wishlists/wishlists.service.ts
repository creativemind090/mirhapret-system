import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Wishlist, Product } from '../../entities';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishlistRepository: Repository<Wishlist>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  async getWishlist(userId: string, skip = 0, take = 20) {
    const [items, total] = await this.wishlistRepository.findAndCount({
      where: { user_id: userId },
      relations: ['product'],
      skip,
      take,
      order: { added_at: 'DESC' },
    });

    return { items, total };
  }

  async addToWishlist(userId: string, productId: string) {
    // Verify product exists
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if already in wishlist
    const existing = await this.wishlistRepository.findOne({
      where: { user_id: userId, product_id: productId },
    });

    if (existing) {
      throw new BadRequestException('Product already in wishlist');
    }

    const wishlistItem = this.wishlistRepository.create({
      user_id: userId,
      product_id: productId,
    });

    const saved = await this.wishlistRepository.save(wishlistItem);
    return {
      ...saved,
      product,
    };
  }

  async removeFromWishlist(userId: string, productId: string) {
    const result = await this.wishlistRepository.delete({
      user_id: userId,
      product_id: productId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('Wishlist item not found');
    }

    return { message: 'Removed from wishlist' };
  }

  async checkInWishlist(userId: string, productId: string) {
    const exists = await this.wishlistRepository.findOne({
      where: { user_id: userId, product_id: productId },
    });

    return { inWishlist: !!exists };
  }

  async clearWishlist(userId: string) {
    await this.wishlistRepository.delete({ user_id: userId });
    return { message: 'Wishlist cleared' };
  }

  async getWishlistCount(userId: string) {
    const count = await this.wishlistRepository.count({
      where: { user_id: userId },
    });

    return { count };
  }
}
