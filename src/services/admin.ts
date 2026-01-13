// Frontend Admin Service
// Calls admin Edge Functions

import { callEdgeFunction } from './api/client';
import type { Tables } from '@/integrations/supabase/types';

export type Product = Tables<'products'> & {
  categories?: Tables<'categories'>;
};

export interface DashboardStats {
  totalProducts: number;
  publishedProducts: number;
  totalOrders: number;
  pendingOrders: number;
  totalUsers: number;
  totalRevenue: number;
  recentOrders: Tables<'orders'>[];
}

export interface CreateProductPayload {
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPercent?: number;
  categoryId?: string;
  sku?: string;
  stockQuantity?: number;
  thumbnailUrl?: string;
  imagesUrls?: string[];
  specifications?: Record<string, string>;
  status?: 'draft' | 'published';
  isFeatured?: boolean;
  isNew?: boolean;
}

export interface UpdateProductPayload extends Partial<CreateProductPayload> {
  id: string;
}

export const adminService = {
  // Get dashboard stats
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await callEdgeFunction<DashboardStats>('admin-stats', {
      method: 'GET',
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch stats');
    }
    
    return response.data;
  },

  // Get all products (including drafts)
  async getProducts(filters?: { status?: string; search?: string }): Promise<Product[]> {
    const params: Record<string, string> = {};
    if (filters?.status) params.status = filters.status;
    if (filters?.search) params.search = filters.search;

    const response = await callEdgeFunction<Product[]>('admin-products', {
      method: 'GET',
      params,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch products');
    }
    
    return response.data;
  },

  // Get single product
  async getProduct(id: string): Promise<Product> {
    const response = await callEdgeFunction<Product>('admin-products', {
      method: 'GET',
      params: { id },
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to fetch product');
    }
    
    return response.data;
  },

  // Create product
  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const response = await callEdgeFunction<Product>('admin-products', {
      method: 'POST',
      body: payload,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create product');
    }
    
    return response.data;
  },

  // Update product
  async updateProduct(payload: UpdateProductPayload): Promise<Product> {
    const response = await callEdgeFunction<Product>('admin-products', {
      method: 'PUT',
      body: payload,
    });
    
    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to update product');
    }
    
    return response.data;
  },

  // Delete product (soft delete)
  async deleteProduct(id: string): Promise<void> {
    const response = await callEdgeFunction('admin-products', {
      method: 'DELETE',
      params: { id },
    });
    
    if (!response.success) {
      throw new Error(response.error || 'Failed to delete product');
    }
  },
};
