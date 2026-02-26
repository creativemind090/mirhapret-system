export interface OrderItem {
  product_id: string;
  product_name?: string;
  sku?: string;
  product_size?: string;
  quantity: number;
  unit_price: number;
  total?: number;
}

export interface Address {
  street_address: string;
  city: string;
  province: string;
  postal_code: string;
  country?: string;
  phone?: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_id?: string;
  customer_email: string;
  customer_phone: string;
  customer_first_name: string;
  customer_last_name?: string;
  items: OrderItem[];
  shipping_address: Address;
  billing_address: Address;
  shipping_same_as_billing: boolean;
  source: 'online' | 'pos';
  store_id?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  subtotal: number;
  tax_amount: number;
  shipping_amount: number;
  discount_amount: number;
  total: number;
  payment_method?: string;
  payment_transaction_id?: string;
  payment_provider?: string;
  tracking_number?: string;
  estimated_delivery_date?: Date;
  notes?: string;
  admin_notes?: string;
  is_priority: boolean;
  created_at: Date;
  updated_at: Date;
  completed_at?: Date;
}

export interface CreateOrderPayload {
  customer_email: string;
  customer_phone: string;
  customer_first_name: string;
  customer_last_name?: string;
  items: OrderItem[];
  shipping_address: Address;
  billing_address?: Address;
  tax_amount?: number;
  shipping_amount?: number;
  discount_amount?: number;
  payment_method?: string;
  notes?: string;
  customer_id?: string;
}
