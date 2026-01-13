process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Routes will be imported here
import productsRoutes from './routes/publicRoutes';
import protectedRoutes from './routes/protectedRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Main Routes
app.use('/api', productsRoutes); // /api/products, /api/categories
app.use('/api', protectedRoutes); // /api/cart, /api/orders, /api/reviews, /api/admin/*

// Health check
app.get('/', (req, res) => {
    res.send('Backend is running!');
});

// Export for Vercel
export default app;

// Only listen if running directly
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}
