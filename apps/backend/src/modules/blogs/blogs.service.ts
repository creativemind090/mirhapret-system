import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Blog } from '../../entities/blog.entity';
import { CreateBlogDto, UpdateBlogDto } from './dto/blog.dto';
import { AppCacheService } from '../../common/cache/cache.service';

const CACHE_BLOGS_PUBLISHED = 'blogs:published';
const BLOG_TTL = 300; // 5 minutes

@Injectable()
export class BlogsService {
  constructor(
    @InjectRepository(Blog)
    private readonly blogsRepo: Repository<Blog>,
    private readonly cache: AppCacheService,
  ) {}

  private async invalidateBlogCache() {
    await this.cache.del(CACHE_BLOGS_PUBLISHED);
  }

  async findAll(): Promise<Blog[]> {
    return this.blogsRepo.find({ order: { created_at: 'DESC' } });
  }

  async findPublished(): Promise<Blog[]> {
    return this.cache.wrap(CACHE_BLOGS_PUBLISHED, BLOG_TTL, () =>
      this.blogsRepo.find({
        where: { is_published: true },
        order: { published_at: 'DESC' },
      }),
    );
  }

  async findBySlug(slug: string): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({ where: { slug } });
    if (!blog) throw new NotFoundException(`Blog "${slug}" not found`);
    return blog;
  }

  async findOne(id: string): Promise<Blog> {
    const blog = await this.blogsRepo.findOne({ where: { id } });
    if (!blog) throw new NotFoundException(`Blog not found`);
    return blog;
  }

  async create(dto: CreateBlogDto): Promise<Blog> {
    const blog = this.blogsRepo.create({
      ...dto,
      published_at: dto.is_published ? new Date() : null,
    });
    const saved = await this.blogsRepo.save(blog) as Blog;
    await this.invalidateBlogCache();
    return saved;
  }

  async update(id: string, dto: UpdateBlogDto): Promise<Blog> {
    const blog = await this.findOne(id);
    if (dto.is_published && !blog.is_published) {
      blog.published_at = new Date();
    }
    Object.assign(blog, dto);
    const saved = await this.blogsRepo.save(blog);
    await this.invalidateBlogCache();
    return saved;
  }

  async remove(id: string): Promise<void> {
    const blog = await this.findOne(id);
    await this.blogsRepo.remove(blog);
    await this.invalidateBlogCache();
  }
}
