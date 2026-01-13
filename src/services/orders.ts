import { callEdgeFunction } from './api/client';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  final_amount: number;
  customer_email: string;
  customer_phone: string;
  customer_address?: string;
  special_notes?: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_title: string;
  product_price: number;
  quantity: number;
  subtotal: number;
  products?: {
    title: string;
    thumbnail_url: string;
  };
}

export interface CreateOrderPayload {
  items: {
    productId: string;
    productTitle: string;
    quantity: number;
    price: number;
  }[];
  customerEmail: string;
  customerPhone: string;
  customerAddress?: string;
  specialNotes?: string;
}

export const ordersService = {
  // Get user's orders
  async getUserOrders(): Promise<Order[]> {
    const response = await callEdgeFunction<Order[]>('orders', {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      return [];
    }

    return response.data;
  },

  // Get single order by ID
  async getOrder(id: string): Promise<Order> {
    const response = await callEdgeFunction<Order>('orders', {
      method: 'GET',
      params: { id },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch order');
    }

    return response.data;
  },

  // Get order items
  async getOrderItems(orderId: string): Promise<OrderItem[]> {
    // In our backend, getOrders with ID returns order with order_items
    const response = await callEdgeFunction<Order & { order_items: OrderItem[] }>('orders', {
      method: 'GET',
      params: { id: orderId },
    });

    if (!response.success || !response.data) {
      return [];
    }

    return response.data.order_items || [];
  },

  // Create new order
  async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const response = await callEdgeFunction<Order>('orders', {
      method: 'POST',
      body: payload,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create order');
    }

    return response.data;
  },

  // Cancel order
  async cancelOrder(orderId: string): Promise<Order> {
    const response = await callEdgeFunction<Order>('orders', {
      method: 'PUT',
      body: { orderId, status: 'cancelled' },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to cancel order');
    }

    return response.data;
  },
};
