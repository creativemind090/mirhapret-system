export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  description?: string;
  category_id: string;
  price: number;
  cost_price?: number;
  tax_rate?: number;
  main_image?: string;
  images?: string[];
  available_sizes?: string[];
  size_guide_html?: string;
  is_active: boolean;
  is_featured: boolean;
  barcode?: string;
  view_count: number;
  purchase_count: number;
  average_rating: number;
  created_at: Date;
  updated_at: Date;
}

export interface ProductFilters {
  category_id?: string;
  search?: string;
  min_price?: number;
  max_price?: number;
  is_featured?: boolean;
  page?: number;
  limit?: number;
}
