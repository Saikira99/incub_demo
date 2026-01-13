import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';
import { Category, Product } from '@/types';

export default function CategoriesPage() {
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [productsMap, setProductsMap] = useState<Record<string, Product[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cats = await api.getCategories();
        setCategoriesList(cats);

        // Fetch a few products for each category for the preview
        const prodData: Record<string, Product[]> = {};
        await Promise.all(cats.map(async (cat) => {
          const prods = await api.getProducts({ categoryId: cat.id, limit: 3 });
          prodData[cat.id] = prods;
        }));
        setProductsMap(prodData);
      } catch (error) {
        console.error('Failed to fetch categories data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const categoryIcons = ['⚡', '🌿', '💪', '🏠', '📈'];
  const categoryImages = [
    'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400',
    'https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=400',
    'https://images.unsplash.com/photo-1558002038-1055907df827?w=400',
    'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400',
  ];

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
            Browse Categories
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated categories featuring innovative products from our incubator startups
          </p>
        </motion.div>

        <div className="grid gap-8">
          {loading ? (
            <div className="text-center py-20 text-muted-foreground animate-pulse">
              Loading categories and products...
            </div>
          ) : (
            categoriesList.map((category, index) => {
              const categoryProducts = productsMap[category.id] || [];
              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow"
                >
                  <div className="grid md:grid-cols-3 gap-0">
                    {/* Category Info */}
                    <div className="p-8 flex flex-col justify-center">
                      <span className="text-4xl mb-4">{categoryIcons[index]}</span>
                      <h2 className="font-display text-2xl font-bold mb-2">{category.name}</h2>
                      <p className="text-muted-foreground mb-4">{category.description}</p>
                      <p className="text-sm text-primary font-medium mb-6">
                        {categoryProducts.length} products available
                      </p>
                      <Button asChild className="w-fit gap-2">
                        <Link to={`/products?category=${category.slug}`}>
                          Browse {category.name}
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>

                    {/* Featured Products Preview */}
                    <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-muted/30">
                      {categoryProducts.slice(0, 3).map((product) => (
                        <Link
                          key={product.id}
                          to={`/products/${product.id}`}
                          className="group"
                        >
                          <div className="aspect-square bg-card rounded-xl overflow-hidden mb-2">
                            <img
                              src={product.thumbnailUrl}
                              alt={product.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                            {product.title}
                          </p>
                          <p className="text-primary font-semibold text-sm">
                            ₹{product.finalPrice.toLocaleString('en-IN')}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
