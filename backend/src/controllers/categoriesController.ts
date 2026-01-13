import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
    try {
        const { slug } = req.query;

        if (slug) {
            const { data, error } = await supabase
                .from('categories')
                .select('*')
                .eq('slug', slug)
                .single();

            if (error) throw error;
            res.status(200).json({ success: true, data });
            return;
        }

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        res.status(200).json({ success: true, data });

    } catch (error) {
        console.error('Categories API error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(400).json({ success: false, error: errorMessage });
    }
};
