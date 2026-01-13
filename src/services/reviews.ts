import { callEdgeFunction } from './api/client';

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  review_text: string | null;
  user_name: string;
  created_at: string;
}

export interface CreateReviewPayload {
  productId: string;
  rating: number;
  reviewText?: string;
  userName: string;
}

export const reviewsService = {
  // Get reviews for a product
  async getProductReviews(productId: string): Promise<Review[]> {
    const response = await callEdgeFunction<Review[]>('reviews', {
      method: 'GET',
      params: { productId },
    });

    if (!response.success || !response.data) {
      return [];
    }

    return response.data;
  },

  // Create a review
  async createReview(payload: CreateReviewPayload): Promise<Review> {
    const response = await callEdgeFunction<Review>('reviews', {
      method: 'POST',
      body: payload,
    });

    if (!response.success || !response.data) {
      throw new Error(response.error || 'Failed to create review');
    }

    return response.data;
  },
};
