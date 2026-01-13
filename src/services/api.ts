const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Maps snake_case backend keys to camelCase frontend keys
 */
const mapProduct = (p: any) => ({
    ...p,
    shortDescription: p.short_description,
    discountPercent: p.discount_percent,
    finalPrice: p.final_price,
    stockQuantity: p.stock_quantity,
    imagesUrls: p.images_urls,
    thumbnailUrl: p.thumbnail_url,
    category: p.categories ? {
        id: p.categories.id,
        name: p.categories.name,
        slug: p.categories.slug,
        iconUrl: p.categories.icon_url,
        description: p.categories.description,
    } : null,
    createdAt: p.created_at,
});

const mapCategory = (c: any) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    iconUrl: c.icon_url,
    description: c.description,
    displayOrder: c.display_order,
});

export const api = {
    async getProducts(params?: any) {
        const url = new URL(`${API_URL}/products`);
        if (params) {
            Object.keys(params).forEach(key => {
                if (params[key] !== undefined) {
                    url.searchParams.append(key, params[key]);
                }
            });
        }
        const response = await fetch(url.toString());
        const result = await response.json();
        if (!result.success) return [];

        // Ensure data is always an array for mapping
        const data = Array.isArray(result.data) ? result.data : [result.data];
        return data.map(mapProduct);
    },

    async getCategories() {
        const response = await fetch(`${API_URL}/categories`);
        const result = await response.json();
        return result.success ? result.data.map(mapCategory) : [];
    },

    // Add other methods as needed (cart, orders, etc.)
};
