import { Response } from 'express';
import { supabaseAdmin, createAuthClient } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

export const adminController = {
    requireAdmin: async (req: AuthRequest, res: Response, next: Function) => {
        try {
            const authClient = createAuthClient(req.token!);
            const { data: { user } } = await authClient.auth.getUser();

            if (!user) {
                res.status(401).json({ success: false, error: 'Unauthorized' });
                return;
            }

            const { data: roleData, error } = await supabaseAdmin
                .from('user_roles')
                .select('role')
                .eq('user_id', user.id)
                .eq('role', 'admin')
                .maybeSingle();

            if (error || !roleData) {
                res.status(403).json({ success: false, error: 'Admin access required' });
                return;
            }

            req.user = user;
            next();
        } catch (error: any) {
            res.status(401).json({ success: false, error: error.message });
        }
    },

    getProducts: async (req: AuthRequest, res: Response) => {
        try {
            const { id, status, search } = req.query;

            if (id) {
                const { data, error } = await supabaseAdmin
                    .from('products')
                    .select('*, categories(*)')
                    .eq('id', id)
                    .single();
                if (error) throw error;
                res.json({ success: true, data });
                return;
            }

            let query = supabaseAdmin
                .from('products')
                .select('*, categories(*)')
                .eq('is_deleted', false);

            if (status) {
                query = query.eq('status', status as string);
            }

            if (search) {
                query = query.or(`title.ilike.%${search}%,sku.ilike.%${search}%`);
            }

            query = query.order('created_at', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    createProduct: async (req: AuthRequest, res: Response) => {
        try {
            const body = req.body;
            const { price, discountPercent = 0 } = body;
            const finalPrice = price - (price * discountPercent / 100);

            const { data, error } = await supabaseAdmin
                .from('products')
                .insert({
                    title: body.title,
                    description: body.description,
                    short_description: body.shortDescription,
                    price: body.price,
                    discount_percent: discountPercent,
                    final_price: finalPrice,
                    category_id: body.categoryId,
                    sku: body.sku,
                    stock_quantity: body.stockQuantity || 0,
                    thumbnail_url: body.thumbnailUrl,
                    images_urls: body.imagesUrls || [],
                    specifications: body.specifications || {},
                    status: body.status || 'draft',
                    is_featured: body.isFeatured || false,
                    is_new: body.isNew || true,
                    created_by_admin_id: req.user.id
                })
                .select()
                .single();

            if (error) throw error;
            res.status(201).json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    updateProduct: async (req: AuthRequest, res: Response) => {
        try {
            const { id, ...updates } = req.body;
            if (!id) throw new Error('Product ID required');

            const { data: existing, error: fetchError } = await supabaseAdmin
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (fetchError) throw fetchError;

            const price = updates.price !== undefined ? updates.price : existing.price;
            const discountPercent = updates.discountPercent !== undefined ? updates.discountPercent : existing.discount_percent;
            const finalPrice = price - (price * discountPercent / 100);

            const { data, error } = await supabaseAdmin
                .from('products')
                .update({
                    ...updates,
                    short_description: updates.shortDescription,
                    discount_percent: discountPercent,
                    final_price: finalPrice,
                    stock_quantity: updates.stockQuantity,
                    images_urls: updates.imagesUrls,
                    is_featured: updates.isFeatured,
                    is_new: updates.isNew,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    deleteProduct: async (req: AuthRequest, res: Response) => {
        try {
            const { id } = req.query;
            const { error } = await supabaseAdmin
                .from('products')
                .update({ is_deleted: true, status: 'draft' })
                .eq('id', id as string);

            if (error) throw error;
            res.json({ success: true });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    getStats: async (req: AuthRequest, res: Response) => {
        try {
            const [
                { count: totalProducts },
                { count: publishedProducts },
                { count: totalOrders },
                { count: pendingOrders },
                { data: recentOrders },
                { count: totalUsers },
                { data: revenueData }
            ] = await Promise.all([
                supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('is_deleted', false),
                supabaseAdmin.from('products').select('*', { count: 'exact', head: true }).eq('status', 'published').eq('is_deleted', false),
                supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }),
                supabaseAdmin.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
                supabaseAdmin.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
                supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
                supabaseAdmin.from('orders').select('final_amount').in('status', ['confirmed', 'completed'])
            ]);

            const totalRevenue = revenueData?.reduce((sum, order) => sum + (order.final_amount || 0), 0) || 0;

            res.json({
                success: true,
                data: {
                    totalProducts,
                    publishedProducts,
                    totalOrders,
                    pendingOrders,
                    recentOrders,
                    totalUsers,
                    totalRevenue,
                }
            });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};
