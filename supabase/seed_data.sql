-- Seed Categories
INSERT INTO public.categories (name, slug, description, display_order)
VALUES 
('Electronics', 'electronics', 'Gadgets and hardware', 1),
('Home & Kitchen', 'home-kitchen', 'Essentials for your home', 2),
('Fashion', 'fashion', 'Trendy apparel and accessories', 3)
ON CONFLICT (slug) DO NOTHING;

-- Seed Products
-- Note: We use subqueries to get category IDs safely and cast 'published' to products_status enum
INSERT INTO public.products (
    category_id, 
    title, 
    description, 
    short_description, 
    price, 
    discount_percent, 
    final_price, 
    stock_quantity, 
    sku, 
    status, 
    is_featured, 
    is_new,
    thumbnail_url
)
SELECT 
    id, 
    'Wireless Headphones', 
    'High-quality noise-canceling wireless headphones with 40-hour battery life.', 
    'Premium Wireless Sound', 
    199.99, 
    10.00, 
    179.99, 
    50, 
    'ELEC-HEAD-001', 
    'published'::public.product_status, 
    true, 
    true,
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e'
FROM public.categories WHERE slug = 'electronics'
UNION ALL
SELECT 
    id, 
    'Smart Watch', 
    'Track your fitness and stay connected with this sleek smartwatch.', 
    'Stylish Fitness Tracker', 
    249.99, 
    0.00, 
    249.99, 
    30, 
    'ELEC-WATCH-002', 
    'published'::public.product_status, 
    false, 
    true,
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30'
FROM public.categories WHERE slug = 'electronics'
UNION ALL
SELECT 
    id, 
    'Coffee Maker', 
    'Professional grade espresso machine for your kitchen.', 
    'Brew like a pro', 
    499.00, 
    5.00, 
    474.05, 
    15, 
    'HOME-COFFEE-003', 
    'published'::public.product_status, 
    true, 
    false,
    'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6'
FROM public.categories WHERE slug = 'home-kitchen'
ON CONFLICT (sku) DO NOTHING;
