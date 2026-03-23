export const GUEST_TOOLS = [
  {
    name: 'get_trending_products',
    description: 'Get currently trending products ranked by customer interest (view-to-sale ratio). Use this when customers ask about popular, trending, or recommended items.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'search_products',
    description: 'Search products by keyword, name, or description. Use when customers are looking for something specific.',
    input_schema: {
      type: 'object' as const,
      properties: {
        query: { type: 'string', description: 'Search term e.g. "lawn suit", "red", "eid collection"' },
      },
      required: ['query'],
    },
  },
  {
    name: 'get_categories',
    description: 'Get all available product categories. Use when customers ask about collections or what types of clothes are available.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
  {
    name: 'get_product_details',
    description: 'Get detailed information about a specific product including price, sizes, and description.',
    input_schema: {
      type: 'object' as const,
      properties: {
        product_id: { type: 'string', description: 'The product UUID' },
      },
      required: ['product_id'],
    },
  },
];

export const AUTH_TOOLS = [
  {
    name: 'get_order_by_number',
    description: 'Look up a specific order by its order number (e.g. ORD-20260321-ABC123). Use when a customer wants to track or check a specific order.',
    input_schema: {
      type: 'object' as const,
      properties: {
        order_number: { type: 'string', description: 'The order number e.g. ORD-20260321-ABC123' },
      },
      required: ['order_number'],
    },
  },
  {
    name: 'get_my_orders',
    description: 'Get recent orders for the logged-in customer. Use when customer asks about their order history or recent purchases.',
    input_schema: {
      type: 'object' as const,
      properties: {},
      required: [],
    },
  },
];
