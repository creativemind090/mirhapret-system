import * as api from '../api-client';

interface ToolContext {
  token?: string;
  userId?: string;
}

export interface ToolResult {
  text: string;
  products?: any[];
}

export async function executeTool(
  toolName: string,
  toolInput: Record<string, any>,
  ctx: ToolContext,
): Promise<ToolResult> {
  try {
    switch (toolName) {
      case 'get_trending_products': {
        const products = await api.getTrendingProducts(Math.min(toolInput.limit ?? 6, 12));
        if (!products.length) return { text: 'No trending products found at the moment.' };
        const formatted = products.map((p: any) =>
          `• ${p.name} — PKR ${Number(p.price).toLocaleString()} | Sizes: ${(p.available_sizes ?? []).join(', ') || 'N/A'} | Category: ${p.category?.name ?? 'N/A'}`
        ).join('\n');
        return { text: `Here are our trending pieces:\n${formatted}`, products };
      }

      case 'search_products': {
        const products = await api.searchProducts(toolInput.query, toolInput.limit ?? 6);
        if (!products.length) return { text: `No products found matching "${toolInput.query}". Try a different search term.` };
        const formatted = products.map((p: any) =>
          `• ${p.name} — PKR ${Number(p.price).toLocaleString()} | Sizes: ${(p.available_sizes ?? []).join(', ') || 'N/A'}`
        ).join('\n');
        return { text: `Found ${products.length} products for "${toolInput.query}":\n${formatted}`, products };
      }

      case 'get_categories': {
        const categories = await api.getCategories();
        if (!categories.length) return { text: 'No categories available right now.' };
        const names = categories.map((c: any) => `• ${c.name}`).join('\n');
        return { text: `Our collections:\n${names}` };
      }

      case 'get_product_details': {
        const product = await api.getProductDetails(toolInput.product_id);
        if (!product) return { text: 'Product not found.' };
        return {
          text: `${product.name}\nPrice: PKR ${Number(product.price).toLocaleString()}\nCategory: ${product.category?.name ?? 'N/A'}\nSizes: ${(product.available_sizes ?? []).join(', ') || 'N/A'}\nDescription: ${product.description ?? 'N/A'}`,
          products: [product],
        };
      }

      case 'get_order_by_number': {
        if (!ctx.token) return { text: 'Authentication required to look up orders.' };
        const order = await api.getOrderByNumber(toolInput.order_number, ctx.token);
        if (!order) return { text: `No order found with number "${toolInput.order_number}". Please check the order number and try again.` };
        return { text: formatOrder(order) };
      }

      case 'get_my_orders': {
        if (!ctx.token || !ctx.userId) return { text: 'Authentication required to view your orders.' };
        const orders = await api.getMyOrders(ctx.userId, ctx.token, toolInput.limit ?? 5);
        if (!orders.length) return { text: "You haven't placed any orders yet." };
        const formatted = orders.map((o: any) => formatOrder(o)).join('\n\n---\n\n');
        return { text: `Your recent orders:\n\n${formatted}` };
      }

      default:
        return { text: `Unknown tool: ${toolName}` };
    }
  } catch (err: any) {
    return { text: `Error executing ${toolName}: ${err.message}` };
  }
}

function formatOrder(order: any): string {
  const items = (order.items ?? [])
    .map((i: any) => `  • ${i.product_name} × ${i.quantity} — PKR ${Number(i.unit_price).toLocaleString()}`)
    .join('\n');
  return [
    `Order: ${order.order_number}`,
    `Status: ${order.status?.toUpperCase()}`,
    `Payment: ${order.payment_status?.toUpperCase()} | Method: ${order.payment_method ?? 'COD'}`,
    `Total: PKR ${Number(order.total).toLocaleString()}`,
    items ? `Items:\n${items}` : '',
    `Placed: ${new Date(order.created_at).toLocaleDateString('en-PK', { dateStyle: 'medium' })}`,
  ].filter(Boolean).join('\n');
}
