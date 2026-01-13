export interface Product {
  id: string;
  title: string;
  description: string;
  shortDescription?: string;
  price: number;
  discountPercent: number;
  finalPrice: number;
  stockQuantity: number;
  category: Category;
  categoryId: string;
  imagesUrls: string[];
  thumbnailUrl: string;
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  isNew?: boolean;
  specifications?: Record<string, string>;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  iconUrl?: string;
  productCount?: number;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  role: 'ADMIN' | 'USER';
  profileImage?: string;
  companyName?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  status: OrderStatus;
  totalAmount: number;
  finalAmount: number;
  customerPhone: string;
  customerEmail: string;
  customerAddress?: string;
  specialNotes?: string;
  items: OrderItem[];
  whatsappLink?: string;
  createdAt: string;
}

export type OrderStatus = 'PENDING' | 'INQUIRY_SENT' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  userImage?: string;
  rating: number;
  reviewText?: string;
  isVerifiedPurchase: boolean;
  helpfulCount: number;
  createdAt: string;
}

export interface Notification {
  id: string;
  type: 'ORDER_STATUS' | 'STOCK_ALERT' | 'DISCOUNT_ALERT' | 'ADMIN_MESSAGE';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}
