import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWishlistStore } from '@/stores/wishlistStore';
import { useCartStore } from '@/stores/cartStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function WishlistPage() {
  const { items, removeFromWishlist, clearWishlist } = useWishlistStore();
  const { addToCart, openCart } = useCartStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (item: typeof items[0]) => {
    addToCart(item.product);
    removeFromWishlist(item.productId);
    openCart();
    toast.success('Moved to cart!', {
      description: item.product.title,
    });
  };

  return (
    <div className="min-h-screen bg-background pt-24 pb-16">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2">My Wishlist</h1>
              <p className="text-muted-foreground">
                {items.length} {items.length === 1 ? 'item' : 'items'} saved
              </p>
            </div>
            {items.length > 0 && (
              <Button variant="outline" onClick={clearWishlist} className="text-destructive">
                Clear All
              </Button>
            )}
          </div>
        </motion.div>

        {items.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-muted rounded-full flex items-center justify-center">
              <Heart className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-muted-foreground mb-6">
              Save items you love by clicking the heart icon
            </p>
            <Button asChild>
              <Link to="/products">Browse Products</Link>
            </Button>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {items.map((item, index) => (
              <motion.div
                key={item.productId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-card rounded-xl p-4 sm:p-6 border border-border flex flex-col sm:flex-row gap-4 sm:gap-6"
              >
                <Link to={`/products/${item.productId}`} className="shrink-0">
                  <img
                    src={item.product.thumbnailUrl}
                    alt={item.product.title}
                    className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg"
                  />
                </Link>

                <div className="flex-1 min-w-0">
                  <Link
                    to={`/products/${item.productId}`}
                    className="font-medium text-lg hover:text-primary transition-colors line-clamp-2"
                  >
                    {item.product.title}
                  </Link>
                  <p className="text-muted-foreground text-sm mt-1">{item.product.category.name}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="font-display text-xl font-bold">
                      {formatPrice(item.product.finalPrice)}
                    </span>
                    {item.product.discountPercent > 0 && (
                      <>
                        <span className="text-muted-foreground line-through text-sm">
                          {formatPrice(item.product.price)}
                        </span>
                        <span className="text-success text-sm font-medium">
                          {item.product.discountPercent}% off
                        </span>
                      </>
                    )}
                  </div>
                  <p
                    className={`text-sm mt-2 ${
                      item.product.stockQuantity > 0 ? 'text-success' : 'text-destructive'
                    }`}
                  >
                    {item.product.stockQuantity > 0
                      ? `In Stock (${item.product.stockQuantity} available)`
                      : 'Out of Stock'}
                  </p>
                </div>

                <div className="flex sm:flex-col gap-2 sm:gap-3">
                  <Button
                    className="flex-1 sm:flex-none gap-2"
                    onClick={() => handleAddToCart(item)}
                    disabled={item.product.stockQuantity === 0}
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="shrink-0 text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    onClick={() => {
                      removeFromWishlist(item.productId);
                      toast.success('Removed from wishlist');
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
