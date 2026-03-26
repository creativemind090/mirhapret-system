/**
 * Meta (Facebook) Pixel helper.
 * Set NEXT_PUBLIC_FB_PIXEL_ID in your .env to enable.
 */

declare global {
  interface Window {
    fbq: (...args: any[]) => void;
    _fbq: any;
  }
}

export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID || '';

export function pixelPageView() {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'PageView');
}

export function pixelViewContent(params: { content_name: string; content_ids: string[]; value: number; currency?: string }) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'ViewContent', { ...params, currency: params.currency ?? 'PKR' });
}

export function pixelAddToCart(params: { content_name: string; content_ids: string[]; value: number; currency?: string; num_items?: number }) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'AddToCart', { ...params, currency: params.currency ?? 'PKR' });
}

export function pixelInitiateCheckout(params: { value: number; num_items: number; currency?: string }) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'InitiateCheckout', { ...params, currency: params.currency ?? 'PKR' });
}

export function pixelPurchase(params: { value: number; num_items: number; order_id: string; currency?: string }) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'Purchase', {
    value: params.value,
    currency: params.currency ?? 'PKR',
    num_items: params.num_items,
    order_id: params.order_id,
  });
}

export function pixelAddToWishlist(params: { content_name: string; content_ids: string[]; value: number }) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'AddToWishlist', { ...params, currency: 'PKR' });
}

export function pixelSearch(query: string) {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', 'Search', { search_string: query });
}
