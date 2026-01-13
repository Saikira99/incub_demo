import { Router } from 'express';
import { getProducts } from '../controllers/productsController';
import { getCategories } from '../controllers/categoriesController';

const router = Router();

// Products
router.get('/products', getProducts);

// Categories
router.get('/categories', getCategories);

export default router;
