import { Response } from 'express';
import { createAuthClient } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const cartController = {
    getCart: async (req: AuthRequest, res: Response) => {
        try {
            const authClient = createAuthClient(req.token!);
            const { data: { user } } = await authClient.auth.getUser();
            if (!user) throw new Error('User not found');

            const { data, error } = await authClient
                .from('carts')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            const items = data?.items || [];
            res.json({ success: true, data: { cart: data, items } });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    addToCart: async (req: AuthRequest, res: Response) => {
        try {
            const authClient = createAuthClient(req.token!);
            const { data: { user } } = await authClient.auth.getUser();
            if (!user) throw new Error('User not found');

            const { productId, quantity = 1 } = req.body;

            const { data: cart, error: fetchError } = await authClient
                .from('carts')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

            let items = cart?.items || [];
            const existingIndex = items.findIndex((item: any) => item.productId === productId);

            if (existingIndex >= 0) {
                items[existingIndex].quantity += quantity;
            } else {
                items.push({ productId, quantity, addedAt: new Date().toISOString() });
            }

            const { data, error } = await authClient
                .from('carts')
                .upsert({
                    user_id: user.id,
                    items,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            res.json({ success: true, data: items });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    updateQuantity: async (req: AuthRequest, res: Response) => {
        try {
            const authClient = createAuthClient(req.token!);
            const { data: { user } } = await authClient.auth.getUser();
            if (!user) throw new Error('User not found');

            const { productId, quantity } = req.body;
            const { data: cart, error: fetchError } = await authClient
                .from('carts')
                .select('*')
                .eq('user_id', user.id)
                .single();

            if (fetchError) throw fetchError;

            let items = cart.items || [];
            if (quantity <= 0) {
                items = items.filter((item: any) => item.productId !== productId);
            } else {
                const index = items.findIndex((item: any) => item.productId === productId);
                if (index >= 0) {
                    items[index].quantity = quantity;
                }
            }

            const { error } = await authClient
                .from('carts')
                .update({ items, updated_at: new Date().toISOString() })
                .eq('user_id', user.id);

            if (error) throw error;
            res.json({ success: true, data: items });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    removeFromCart: async (req: AuthRequest, res: Response) => {
        try {
            const authClient = createAuthClient(req.token!);
            const { data: { user } } = await authClient.auth.getUser();
            if (!user) throw new Error('User not found');

            const { productId } = req.query;

            if (productId) {
                const { data: cart, error: fetchError } = await authClient
                    .from('carts')
                    .select('*')
                    .eq('user_id', user.id)
                    .single();

                if (fetchError) throw fetchError;

                let items = cart.items || [];
                items = items.filter((item: any) => item.productId !== productId);

                const { error } = await authClient
                    .from('carts')
                    .update({ items, updated_at: new Date().toISOString() })
                    .eq('user_id', user.id);

                if (error) throw error;
                res.json({ success: true, data: items });
            } else {
                const { error } = await authClient
                    .from('carts')
                    .update({ items: [], updated_at: new Date().toISOString() })
                    .eq('user_id', user.id);

                if (error) throw error;
                res.json({ success: true, data: [] });
            }
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};
