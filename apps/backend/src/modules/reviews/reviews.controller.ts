import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto, ApproveReviewDto } from './dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get('product/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const result = await this.reviewsService.getProductReviews(
      productId,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
    return {
      message: 'Product reviews retrieved',
      data: result.reviews,
      total: result.total,
    };
  }

  @Get('product/:productId/rating')
  async getProductRating(@Param('productId') productId: string) {
    const rating = await this.reviewsService.getProductRating(productId);
    return {
      message: 'Product rating retrieved',
      data: rating,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createReview(
    @CurrentUser() user: any,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    const review = await this.reviewsService.createReview(user.id, createReviewDto);
    return {
      message: 'Review submitted successfully (pending approval)',
      data: review,
    };
  }

  @Get('user/my-reviews')
  @UseGuards(JwtAuthGuard)
  async getUserReviews(
    @CurrentUser() user: any,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const result = await this.reviewsService.getUserReviews(
      user.id,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
    return {
      message: 'Your reviews retrieved',
      data: result.reviews,
      total: result.total,
    };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateReview(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.reviewsService.updateReview(user.id, id, updateReviewDto);
    return {
      message: 'Review updated successfully',
      data: review,
    };
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async deleteReview(@CurrentUser() user: any, @Param('id') id: string) {
    const result = await this.reviewsService.deleteReview(user.id, id);
    return result;
  }

  @Post(':id/helpful')
  @HttpCode(HttpStatus.OK)
  async markHelpful(@Param('id') id: string) {
    const review = await this.reviewsService.markHelpful(id);
    return {
      message: 'Review marked as helpful',
      data: review,
    };
  }

  // Admin endpoints
  @Get('admin/pending')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super_admin')
  async getPendingReviews(@Query('skip') skip?: string, @Query('take') take?: string) {
    const result = await this.reviewsService.getPendingReviews(
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
    return {
      message: 'Pending reviews retrieved',
      data: result.reviews,
      total: result.total,
    };
  }

  @Put('admin/:id/approve')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super_admin')
  async approveReview(
    @Param('id') id: string,
    @Body() approveReviewDto: ApproveReviewDto,
  ) {
    const review = await this.reviewsService.approveReview(id, approveReviewDto);
    return {
      message: 'Review approval status updated',
      data: review,
    };
  }
}
