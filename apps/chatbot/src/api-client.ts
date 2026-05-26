import axios from 'axios';

const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:8000/api/v1';

const client = axios.create({ baseURL: BACKEND_URL, timeout: 10000 });

export async function getTrendingProducts(limit = 6): Promise<any[]> {
  try {
    const res = await client.get('/products', {
      params: { is_active: true, sort_by: 'view_ratio', take: limit },
    });
    return res.data.data ?? [];
  } catch { return []; }
}

export async function searchProducts(query: string, limit = 6): Promise<any[]> {
  try {
    const res = await client.get('/products', {
      params: { search: query, is_active: true, take: limit },
    });
    return res.data.data ?? [];
  } catch { return []; }
}

export async function getCategories(): Promise<any[]> {
  try {
    const res = await client.get('/categories');
    return res.data.data ?? [];
  } catch { return []; }
}

export async function getProductDetails(productId: string): Promise<any | null> {
  try {
    const res = await client.get(`/products/${productId}`);
    return res.data.data ?? null;
  } catch { return null; }
}

export async function getOrderByNumber(orderNumber: string, token: string): Promise<any | null> {
  try {
    const res = await client.get('/orders', {
      params: { order_number: orderNumber, take: 1 },
      headers: { Authorization: `Bearer ${token}` },
    });
    const orders = res.data.data ?? [];
    return orders[0] ?? null;
  } catch { return null; }
}

export async function getMyOrders(customerId: string, token: string, limit = 5): Promise<any[]> {
  try {
    const res = await client.get('/orders', {
      params: { customer_id: customerId, take: limit },
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data ?? [];
  } catch { return []; }
}

export async function getUserProfile(token: string): Promise<any | null> {
  try {
    const res = await client.get('/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.data ?? null;
  } catch { return null; }
}
