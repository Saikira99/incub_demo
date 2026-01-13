import { Request, Response } from 'express';
import { supabase, createAuthClient } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const reviewsController = {
    getReviews: async (req: Request, res: Response) => {
        try {
            const { productId } = req.query;
            if (!productId) throw new Error('Product ID required');

            const { data, error } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (error) throw error;
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    createReview: async (req: AuthRequest, res: Response) => {
        try {
            const authClient = createAuthClient(req.token!);
            const { productId, rating, reviewText, userName } = req.body;

            const { data, error } = await authClient
                .from('reviews')
                .insert({
                    product_id: productId,
                    rating,
                    review_text: reviewText,
                    user_name: userName
                })
                .select()
                .single();

            if (error) throw error;
            res.status(201).json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};
