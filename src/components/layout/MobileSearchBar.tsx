import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Mic, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MobileSearchBarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileSearchBar({ isOpen, onClose }: MobileSearchBarProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/products?search=${encodeURIComponent(query.trim())}`);
      onClose();
      setQuery('');
    }
  };

  const recentSearches = ['Egg Incubator', 'Auto Turner', 'Digital Controller', 'Humidity Sensor'];
  const popularCategories = ['Incubators', 'Accessories', 'Spare Parts', 'Thermometers'];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-50 bg-background md:hidden"
        >
          {/* Search Header */}
          <div className="flex items-center gap-3 p-3 border-b border-border bg-card">
            <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
              <X className="h-5 w-5" />
            </Button>
            <form onSubmit={handleSearch} className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search for products, brands and more"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-10 pr-20 h-10 text-sm"
                autoFocus
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <button type="button" className="p-1.5 text-muted-foreground hover:text-foreground">
                  <Mic className="h-4 w-4" />
                </button>
                <button type="button" className="p-1.5 text-muted-foreground hover:text-foreground">
                  <Camera className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>

          {/* Search Suggestions */}
          <div className="p-4 overflow-y-auto h-[calc(100vh-60px)]">
            {/* Recent Searches */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Recent Searches
              </h3>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => {
                      navigate(`/products?search=${encodeURIComponent(term)}`);
                      onClose();
                    }}
                    className="px-3 py-1.5 bg-muted text-sm rounded-full hover:bg-muted/80 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Categories */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Popular Categories
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {popularCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      navigate(`/products?category=${cat.toLowerCase()}`);
                      onClose();
                    }}
                    className="p-3 bg-muted/50 text-sm rounded-xl text-left hover:bg-muted transition-colors"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Trending */}
            <div>
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Trending Now 🔥
              </h3>
              <div className="space-y-2">
                {['Premium 112 Egg Incubator', 'Digital Temperature Controller', 'Auto Egg Turner Motor'].map(
                  (item, index) => (
                    <button
                      key={item}
                      onClick={() => {
                        navigate(`/products?search=${encodeURIComponent(item)}`);
                        onClose();
                      }}
                      className="flex items-center gap-3 w-full p-3 hover:bg-muted rounded-xl transition-colors"
                    >
                      <span className="text-primary font-bold text-sm">{index + 1}</span>
                      <span className="text-sm">{item}</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
