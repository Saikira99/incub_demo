// Central export for all frontend services
// Import from '@/services' for clean imports

export { authService } from './auth';
export { productsService, categoriesService } from './products';
export { ordersService } from './orders';
export { cartService } from './cart';
export { reviewsService } from './reviews';
export { notificationsService } from './notifications';
export { adminService } from './admin';
export { callEdgeFunction } from './api/client';

// Re-export types
export type { SignUpPayload, SignInPayload } from './auth';
export type { Product, Category } from './products';
export type { Order, OrderItem, CreateOrderPayload } from './orders';
export type { Cart, CartItemData } from './cart';
export type { Review, CreateReviewPayload } from './reviews';
export type { Notification } from './notifications';
export type { DashboardStats, CreateProductPayload, UpdateProductPayload } from './admin';
