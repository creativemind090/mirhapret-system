import {
  Controller, Get, Post, Put, Delete,
  Param, Body, UseGuards, HttpCode, HttpStatus,
} from '@nestjs/common';
import { BlogsService } from './blogs.service';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Public } from '../../common/decorators/public.decorator';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  /** Public: all published blogs */
  @Get()
  @Public()
  async getPublished() {
    const data = await this.blogsService.findPublished();
    return { data };
  }

  /** Public: blog by slug */
  @Get('slug/:slug')
  @Public()
  async getBySlug(@Param('slug') slug: string) {
    const data = await this.blogsService.findBySlug(slug);
    return { data };
  }

  /** Admin: all blogs (including drafts) */
  @Get('admin/all')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super_admin')
  async getAll() {
    const data = await this.blogsService.findAll();
    return { data };
  }

  /** Admin: get single blog for editing */
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super_admin')
  async getOne(@Param('id') id: string) {
    const data = await this.blogsService.findOne(id);
    return { data };
  }

  /** Admin: create */
  @Post()
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateBlogDto) {
    const data = await this.blogsService.create(dto);
    return { message: 'Blog created', data };
  }

  /** Admin: update */
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super_admin')
  async update(@Param('id') id: string, @Body() dto: UpdateBlogDto) {
    const data = await this.blogsService.update(id, dto);
    return { message: 'Blog updated', data };
  }

  /** Admin: delete */
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @Roles('admin', 'super_admin')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.blogsService.remove(id);
  }
}
