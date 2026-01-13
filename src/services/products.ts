import { callEdgeFunction } from './api/client';

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  final_price: number;
  discount_percent: number;
  category_id: string;
  thumbnail_url: string;
  images_urls: string[];
  status: string;
  is_featured: boolean;
  is_new: boolean;
  stock_quantity: number;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_url: string;
  description: string;
  display_order: number;
}

export const productsService = {
  // Get all products with optional filters
  async getProducts(filters?: any) {
    const response = await callEdgeFunction<Product[]>('products', {
      method: 'GET',
      params: filters,
    });
    return response.success ? response.data || [] : [];
  },

  // Get single product by ID
  async getProduct(id: string) {
    const response = await callEdgeFunction<Product>('products', {
      method: 'GET',
      params: { id },
    });
    return response.success ? response.data : null;
  },

  // Get all categories
  async getCategories() {
    const response = await callEdgeFunction<Category[]>('categories', {
      method: 'GET',
    });
    return response.success ? response.data || [] : [];
  },
};

export const categoriesService = {
  getCategories: productsService.getCategories.bind(productsService),
};
