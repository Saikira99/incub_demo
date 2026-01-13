import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { cartController } from '../controllers/cartController';
import { ordersController } from '../controllers/ordersController';
import { reviewsController } from '../controllers/reviewsController';
import { adminController } from '../controllers/adminController';

const router = Router();

// Cart Routes
router.get('/cart', requireAuth, cartController.getCart);
router.post('/cart', requireAuth, cartController.addToCart);
router.put('/cart', requireAuth, cartController.updateQuantity);
router.delete('/cart', requireAuth, cartController.removeFromCart);

// Order Routes
router.get('/orders', requireAuth, ordersController.getOrders);
router.post('/orders', requireAuth, ordersController.createOrder);
router.put('/orders', requireAuth, ordersController.updateStatus); // Valid for cancelling

// Review Routes
router.get('/reviews', reviewsController.getReviews); // Public
router.post('/reviews', requireAuth, reviewsController.createReview);

// Admin Routes
router.use('/admin', adminController.requireAdmin);
router.get('/admin/products', adminController.getProducts);
router.post('/admin/products', adminController.createProduct);
router.put('/admin/products', adminController.updateProduct);
router.delete('/admin/products', adminController.deleteProduct);
router.get('/admin/stats', adminController.getStats);

export default router;
