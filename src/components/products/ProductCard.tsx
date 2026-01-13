import { motion } from 'framer-motion';
import { Heart, ShoppingCart, Star, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '@/types';
import { useCartStore } from '@/stores/cartStore';
import { useWishlistStore } from '@/stores/wishlistStore';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart, openCart } = useCartStore();
  const { toggleWishlist, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success('Added to cart!', {
      description: product.title,
      action: {
        label: 'View Cart',
        onClick: openCart,
      },
    });
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    toast.success(inWishlist ? 'Removed from wishlist' : 'Added to wishlist!');
  };

  const discountAmount = product.price - product.finalPrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group bg-card rounded-xl overflow-hidden border border-border hover:shadow-lg transition-all duration-300"
    >
      <Link to={`/products/${product.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <img
            src={product.thumbnailUrl}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />

          {/* Badges - Top Left */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.discountPercent > 0 && (
              <span className="bg-destructive text-destructive-foreground text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                {product.discountPercent}% OFF
              </span>
            )}
            {product.isNew && (
              <span className="bg-success text-success-foreground text-[10px] sm:text-xs font-bold px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                NEW
              </span>
            )}
          </div>

          {/* Wishlist Button - Top Right */}
          <button
            onClick={handleToggleWishlist}
            className="absolute top-2 right-2 w-8 h-8 sm:w-9 sm:h-9 bg-card/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-md active:scale-95 transition-transform"
          >
            <Heart
              className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${
                inWishlist ? 'fill-destructive text-destructive' : 'text-muted-foreground'
              }`}
            />
          </button>
        </div>

        {/* Content */}
        <div className="p-2.5 sm:p-3">
          {/* Category */}
          <p className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider mb-0.5 sm:mb-1 truncate">
            {product.category.name}
          </p>

          {/* Title */}
          <h3 className="font-medium text-xs sm:text-sm text-foreground line-clamp-2 min-h-[2.5rem] sm:min-h-[2.75rem] mb-1.5 sm:mb-2 leading-tight">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-1.5 sm:mb-2">
            <div className="flex items-center gap-0.5 bg-success/10 text-success px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-semibold">
              <span>{product.rating.toFixed(1)}</span>
              <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 fill-current" />
            </div>
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              ({product.reviewCount})
            </span>
          </div>

          {/* Price */}
          <div className="flex flex-wrap items-baseline gap-1 sm:gap-2 mb-2 sm:mb-3">
            <span className="font-bold text-sm sm:text-base text-foreground">
              {formatPrice(product.finalPrice)}
            </span>
            {product.discountPercent > 0 && (
              <>
                <span className="text-[10px] sm:text-xs text-muted-foreground line-through">
                  {formatPrice(product.price)}
                </span>
                <span className="text-[10px] sm:text-xs text-success font-medium">
                  Save {formatPrice(discountAmount)}
                </span>
              </>
            )}
          </div>

          {/* Delivery Info */}
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3">
            Free delivery by <span className="font-medium text-foreground">Tomorrow</span>
          </p>
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-2.5 pb-2.5 sm:px-3 sm:pb-3">
        <Button
          onClick={handleAddToCart}
          size="sm"
          className="w-full h-8 sm:h-9 text-xs sm:text-sm font-medium gap-1.5"
        >
          <Plus className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          Add to Cart
        </Button>
      </div>
    </motion.div>
  );
}
