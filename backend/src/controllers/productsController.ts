import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getProducts = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id, categoryId, search, featured, new: newArrivals, limit = '20' } = req.query;

        if (id) {
            const { data, error } = await supabase
                .from('products')
                .select('*, categories(*)')
                .eq('id', id)
                .eq('status', 'published')
                .eq('is_deleted', false)
                .single();

            if (error) throw error;
            if (!data) {
                res.status(404).json({ success: false, error: 'Product not found' });
                return;
            }

            res.status(200).json({ success: true, data });
            return;
        }

        let query = supabase
            .from('products')
            .select('*, categories(*)')
            .eq('status', 'published')
            .eq('is_deleted', false);

        if (categoryId) {
            query = query.eq('category_id', categoryId);
        }

        if (search) {
            query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
        }

        if (featured === 'true') {
            query = query.eq('is_featured', true);
        }

        if (newArrivals === 'true') {
            query = query.eq('is_new', true).order('created_at', { ascending: false });
        }

        query = query.limit(parseInt(limit as string));

        const { data, error } = await query;

        if (error) throw error;
        res.status(200).json({ success: true, data });

    } catch (error) {
        console.error('Products API error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({ success: false, error: errorMessage });
    }
};
