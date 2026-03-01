import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private searchService: SearchService) {}

  @Get()
  async searchAll(
    @Query('q') query: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const result = await this.searchService.searchAll(
      query,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
    return {
      message: 'Search results retrieved',
      data: result,
    };
  }

  @Get('products')
  async searchProducts(
    @Query('q') query: string,
    @Query('category_id') categoryId?: string,
    @Query('min_price') minPrice?: string,
    @Query('max_price') maxPrice?: string,
    @Query('is_featured') isFeatured?: string,
    @Query('skip') skip?: string,
    @Query('take') take?: string,
  ) {
    const filters = {
      category_id: categoryId,
      min_price: minPrice ? parseFloat(minPrice) : undefined,
      max_price: maxPrice ? parseFloat(maxPrice) : undefined,
      is_featured: isFeatured,
    };

    const result = await this.searchService.searchProducts(
      query,
      filters,
      skip ? parseInt(skip) : 0,
      take ? parseInt(take) : 20,
    );
    return {
      message: 'Products found',
      data: result.products,
      total: result.total,
    };
  }

  @Get('suggestions')
  async getSearchSuggestions(@Query('q') query: string, @Query('limit') limit?: string) {
    const suggestions = await this.searchService.getSearchSuggestions(
      query,
      limit ? parseInt(limit) : 10,
    );
    return {
      message: 'Suggestions retrieved',
      data: suggestions,
    };
  }

  @Get('trending')
  async getTrendingSearches(@Query('limit') limit?: string) {
    const trending = await this.searchService.getTrendingSearches(limit ? parseInt(limit) : 10);
    return {
      message: 'Trending searches retrieved',
      data: trending,
    };
  }
}
