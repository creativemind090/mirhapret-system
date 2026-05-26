export class CreateBlogDto {
  title: string;
  slug: string;
  excerpt?: string;
  category?: string;
  author?: string;
  tags?: string[];
  cover_image?: string;
  cover_gradient?: string;
  content_html?: string;
  content_blocks?: string;
  read_time?: string;
  is_published?: boolean;
}

export class UpdateBlogDto {
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  author?: string;
  tags?: string[];
  cover_image?: string;
  cover_gradient?: string;
  content_html?: string;
  content_blocks?: string;
  read_time?: string;
  is_published?: boolean;
}
