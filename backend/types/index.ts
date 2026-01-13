// Backend-specific TypeScript types
// These types are used by Edge Functions and backend services

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Order types for backend processing
export interface OrderPayload {
  userId: string;
  items: OrderItemPayload[];
  shippingAddress: ShippingAddress;
  paymentMethod: string;
}

export interface OrderItemPayload {
  productId: string;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

// Product types for backend
export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: 'active' | 'draft' | 'archived';
  search?: string;
}

// Notification types
export interface NotificationPayload {
  userId: string;
  type: 'order_status' | 'promotion' | 'system' | 'review';
  title: string;
  message: string;
  data?: Record<string, unknown>;
}

// Auth types
export interface AuthPayload {
  email: string;
  password: string;
  fullName?: string;
  phone?: string;
}
