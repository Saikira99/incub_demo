// Cart service for frontend
// Handles cart using JSON items field in carts table

import { callEdgeFunction } from './api/client';
import { CartItem } from '@/types';

// Cart item structure matching the backend/database
export interface CartItemData {
  productId: string;
  quantity: number;
  addedAt: string;
}

export const cartService = {
  // Get user's cart
  async getCart() {
    const response = await callEdgeFunction<{ cart: any; items: CartItemData[] }>('cart', {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      return null;
    }

    return response.data.cart;
  },

  // Get cart items parsed
  async getCartItems(): Promise<CartItemData[]> {
    const response = await callEdgeFunction<{ cart: any; items: CartItemData[] }>('cart', {
      method: 'GET',
    });

    if (!response.success || !response.data) {
      return [];
    }

    return response.data.items || [];
  },

  // Add item to cart
  async addToCart(productId: string, quantity = 1) {
    const response = await callEdgeFunction<CartItemData[]>('cart', {
      method: 'POST',
      body: { productId, quantity },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to add to cart');
    }

    return response.data;
  },

  // Update cart item quantity
  async updateQuantity(productId: string, quantity: number) {
    const response = await callEdgeFunction<CartItemData[]>('cart', {
      method: 'PUT',
      body: { productId, quantity },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update quantity');
    }

    return response.data;
  },

  // Remove item from cart
  async removeFromCart(productId: string) {
    const response = await callEdgeFunction<CartItemData[]>('cart', {
      method: 'DELETE',
      params: { productId },
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to remove from cart');
    }

    return response.data;
  },

  // Clear entire cart
  async clearCart() {
    const response = await callEdgeFunction<CartItemData[]>('cart', {
      method: 'DELETE',
    });

    if (!response.success) {
      throw new Error(response.error || 'Failed to clear cart');
    }
  },
};
