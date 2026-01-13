import { Response } from 'express';
import { createAuthClient } from '../config/supabase';
import { AuthRequest } from '../middleware/auth';

function generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ORD-${timestamp}-${random}`;
}

export const ordersController = {
    getOrders: async (req: AuthRequest, res: Response) => {
        try {
            const authClient = createAuthClient(req.token!);
            const { id: orderId } = req.query;

            if (orderId) {
                const { data, error } = await authClient
                    .from('orders')
                    .select('*, order_items(*)')
                    .eq('id', orderId)
                    .single();

                if (error) throw error;
                res.json({ success: true, data });
            } else {
                const { data, error } = await authClient
                    .from('orders')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (error) throw error;
                res.json({ success: true, data });
            }
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    createOrder: async (req: AuthRequest, res: Response) => {
        try {
            const authClient = createAuthClient(req.token!);
            const { data: { user } } = await authClient.auth.getUser();
            if (!user) throw new Error('User not found');

            const { items, customerEmail, customerPhone, customerAddress, specialNotes } = req.body;

            let totalAmount = 0;
            const orderItems = [];

            for (const item of items) {
                const { data: product, error: prodError } = await authClient
                    .from('products')
                    .select('id, title, final_price')
                    .eq('id', item.productId)
                    .single();

                if (prodError) throw prodError;

                if (product) {
                    const subtotal = product.final_price * item.quantity;
                    totalAmount += subtotal;
                    orderItems.push({
                        product_id: product.id,
                        product_title: product.title,
                        product_price: product.final_price,
                        quantity: item.quantity,
                        subtotal,
                    });
                }
            }

            const { data: order, error: orderError } = await authClient
                .from('orders')
                .insert({
                    user_id: user.id,
                    order_number: generateOrderNumber(),
                    customer_email: customerEmail,
                    customer_phone: customerPhone,
                    customer_address: customerAddress,
                    special_notes: specialNotes,
                    total_amount: totalAmount,
                    final_amount: totalAmount,
                    status: 'pending'
                })
                .select()
                .single();

            if (orderError) throw orderError;

            const itemsWithOrderId = orderItems.map(item => ({
                ...item,
                order_id: order.id
            }));

            const { error: itemsError } = await authClient
                .from('order_items')
                .insert(itemsWithOrderId);

            if (itemsError) throw itemsError;

            res.status(201).json({ success: true, data: order });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    },

    updateStatus: async (req: AuthRequest, res: Response) => {
        try {
            const authClient = createAuthClient(req.token!);
            const { orderId, status } = req.body;

            const { data, error } = await authClient
                .from('orders')
                .update({ status, updated_at: new Date().toISOString() })
                .eq('id', orderId)
                .select()
                .single();

            if (error) throw error;
            res.json({ success: true, data });
        } catch (error: any) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
};
