import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, ThermometerSun, Droplets, RotateCw, Shield, Truck, HeadphonesIcon, ChevronRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductGrid } from '@/components/products/ProductGrid';
import { WarmParticles, EggHatchAnimation } from '@/components/animations/EggHatchAnimation';
import { FloatingFeathers } from '@/components/animations/FeatherAnimation';
import { api } from '@/services/api';
import { Product, Category } from '@/types';
import LoadingScreen from '@/components/ui/LoadingScreen';

export default function LandingPage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      try {
        const [featuredData, newData, categoriesData] = await Promise.all([
          api.getProducts({ featured: true, limit: 4 }),
          api.getProducts({ new: true, limit: 4 }),
          api.getCategories(),
        ]);
        setFeaturedProducts(featuredData);
        setNewArrivals(newData);
        setCategoriesList(categoriesData);
        setDataReady(true);
      } catch (error) {
        console.error('Failed to fetch landing page data:', error);
      } finally {
        // Ensure at least 4 seconds of loading to show the full natural hatching sequence
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 4000 - elapsedTime);

        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    };
    fetchData();
  }, []);
  const features = [
    {
      icon: ThermometerSun,
      title: 'Precise Temperature',
      description: 'Digital control ±0.1°C',
    },
    {
      icon: Droplets,
      title: 'Humidity Control',
      description: 'Auto regulation',
    },
    {
      icon: RotateCw,
      title: 'Auto Turning',
      description: 'Every 2 hours',
    },
    {
      icon: Shield,
      title: '2 Year Warranty',
      description: 'Peace of mind',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <>
      <LoadingScreen isLoading={isLoading} />
      <div className={`min-h-screen overflow-hidden bg-background pb-16 md:pb-0 transition-opacity duration-700 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {/* Hero Section - Mobile Optimized */}
        <section className="relative min-h-[85vh] md:min-h-screen flex items-center justify-center overflow-hidden bg-gray-950">
          {/* Background */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=1920&q=80"
              alt="Farm Background"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-gray-950/80 via-gray-950/60 to-gray-950" />
          </div>

          {/* Content */}
          <div className="relative z-10 container-custom text-center px-4 pt-20 pb-8 md:py-32">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="max-w-4xl mx-auto"
            >
              {/* Top Badge - Mobile Compact */}
              <motion.div variants={itemVariants} className="mb-4 md:mb-8">
                <span className="inline-flex items-center gap-2 md:gap-3 bg-white/10 backdrop-blur-md text-white px-3 md:px-6 py-2 md:py-3 rounded-full text-xs md:text-sm font-medium border border-white/20">
                  <span className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span>🇮🇳 Made in India</span>
                  </span>
                  <span className="hidden sm:inline w-px h-4 bg-white/30" />
                  <span className="hidden sm:inline">⭐ 4.9 Rating</span>
                </span>
              </motion.div>

              {/* Main Heading - Responsive */}
              <motion.h1
                variants={itemVariants}
                className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] mb-4 md:mb-8"
              >
                Hatch Success
                <span className="block bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                  Starts Here
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                variants={itemVariants}
                className="text-base sm:text-lg md:text-xl text-gray-300 mb-6 md:mb-10 max-w-xl mx-auto leading-relaxed px-4"
              >
                India's #1 egg incubators with <span className="text-orange-400 font-semibold">98% hatch rate</span>.
                Precision technology for poultry farming.
              </motion.p>

              {/* CTA Buttons - Stacked on Mobile */}
              <motion.div
                variants={itemVariants}
                className="flex flex-col sm:flex-row gap-3 justify-center px-4 mb-8 md:mb-12"
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white h-12 md:h-14 px-6 md:px-10 rounded-xl shadow-xl shadow-orange-500/30 font-semibold text-sm md:text-base">
                  <Link to="/products" className="flex items-center gap-2">
                    Shop Now
                    <ArrowRight className="h-4 w-4 md:h-5 md:w-5" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 h-12 md:h-14 px-6 md:px-10 rounded-xl font-semibold text-sm md:text-base">
                  <Link to="/categories">
                    View Categories
                  </Link>
                </Button>
              </motion.div>

              {/* Stats Grid - 2x2 on Mobile */}
              <motion.div
                variants={itemVariants}
                className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 max-w-2xl mx-auto px-2"
              >
                {[
                  { value: '98%', label: 'Hatch Rate', color: 'from-orange-500 to-amber-500' },
                  { value: '15K+', label: 'Farmers', color: 'from-emerald-500 to-green-500' },
                  { value: '50+', label: 'Models', color: 'from-blue-500 to-cyan-500' },
                  { value: '2 Yr', label: 'Warranty', color: 'from-purple-500 to-pink-500' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white/10 backdrop-blur-md rounded-xl p-3 md:p-5 border border-white/10"
                  >
                    <p className={`text-xl md:text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                      {stat.value}
                    </p>
                    <p className="text-gray-400 text-[10px] md:text-sm mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Quick Categories - Horizontal Scroll */}
        <section className="py-4 md:py-6 bg-card border-b border-border overflow-hidden">
          <div className="container-custom">
            <div className="flex gap-2 md:gap-3 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4">
              {categoriesList.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="flex-shrink-0 flex flex-col items-center gap-1 p-2 md:p-3 min-w-[70px] md:min-w-[90px] bg-muted/50 hover:bg-muted rounded-xl transition-colors"
                >
                  <span className="text-2xl md:text-3xl">{category.iconUrl}</span>
                  <span className="text-[10px] md:text-xs font-medium text-center line-clamp-1">{category.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Features - Compact Mobile Strip */}
        <section className="py-4 md:py-8 bg-gradient-to-r from-primary/5 to-secondary/5">
          <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
              {features.map((feature) => (
                <div
                  key={feature.title}
                  className="flex items-center gap-2 md:gap-3 p-2.5 md:p-4 bg-card rounded-xl border border-border"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-xs md:text-sm truncate">{feature.title}</h3>
                    <p className="text-[10px] md:text-xs text-muted-foreground truncate">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Deal of the Day Banner */}
        <section className="py-3 md:py-4 bg-gradient-to-r from-orange-500 to-amber-500">
          <div className="container-custom">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <Zap className="h-4 w-4 md:h-5 md:w-5 text-white" />
                <span className="text-white font-semibold text-xs md:text-sm">Deal of the Day</span>
                <span className="hidden sm:inline text-white/80 text-xs md:text-sm">Up to 40% OFF</span>
              </div>
              <Link to="/products" className="flex items-center gap-1 text-white text-xs md:text-sm font-medium">
                View All
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-6 md:py-12 bg-background">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h2 className="font-display text-lg md:text-2xl lg:text-3xl font-bold">
                  Best Sellers
                </h2>
                <p className="text-muted-foreground text-xs md:text-sm mt-0.5">
                  Trusted by 15,000+ farmers
                </p>
              </div>
              <Link to="/products" className="flex items-center gap-1 text-primary text-xs md:text-sm font-medium">
                View All
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </div>

            <ProductGrid products={featuredProducts} columns={4} />
          </div>
        </section>

        {/* Categories Grid - Compact */}
        <section className="py-6 md:py-12 bg-muted/30">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <h2 className="font-display text-lg md:text-2xl lg:text-3xl font-bold">
                Shop by Category
              </h2>
              <Link to="/categories" className="flex items-center gap-1 text-primary text-xs md:text-sm font-medium">
                View All
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-2 md:gap-4">
              {categoriesList.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="block p-3 md:p-5 bg-card rounded-xl text-center group hover:shadow-md transition-all duration-300 border border-border"
                >
                  <div className="text-2xl md:text-4xl mb-1 md:mb-2 group-hover:scale-110 transition-transform">
                    {category.iconUrl}
                  </div>
                  <h3 className="font-medium text-[10px] md:text-sm group-hover:text-primary transition-colors line-clamp-1">
                    {category.name}
                  </h3>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* New Arrivals */}
        <section className="py-6 md:py-12 bg-background">
          <div className="container-custom">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <div>
                <h2 className="font-display text-lg md:text-2xl lg:text-3xl font-bold">
                  New Arrivals
                </h2>
                <p className="text-muted-foreground text-xs md:text-sm mt-0.5">
                  Fresh from our workshop
                </p>
              </div>
              <Link to="/products?sort=newest" className="flex items-center gap-1 text-primary text-xs md:text-sm font-medium">
                View All
                <ChevronRight className="h-3 w-3 md:h-4 md:w-4" />
              </Link>
            </div>

            <ProductGrid products={newArrivals} columns={4} />
          </div>
        </section>

        {/* Trust Badges - Compact */}
        <section className="py-4 md:py-8 bg-card border-y border-border">
          <div className="container-custom">
            <div className="grid grid-cols-3 gap-2 md:gap-6">
              {[
                { icon: Truck, title: 'Free Shipping', desc: 'Above ₹5,000' },
                { icon: Shield, title: 'Warranty', desc: 'Up to 3 years' },
                { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Expert help' },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-center md:text-left p-2 md:p-4"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-4 w-4 md:h-5 md:w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[10px] md:text-sm">{item.title}</h3>
                    <p className="text-muted-foreground text-[9px] md:text-xs hidden sm:block">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-10 md:py-20 warm-gradient text-white relative overflow-hidden">
          <FloatingFeathers />
          <WarmParticles />

          <div className="container-custom text-center relative z-10 px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="mb-4 md:mb-6">
                <EggHatchAnimation size="lg" animate={true} />
              </div>

              <h2 className="font-display text-xl md:text-3xl lg:text-4xl font-bold mb-3 md:mb-4">
                Ready to Start Hatching?
              </h2>
              <p className="text-white/80 text-sm md:text-base mb-5 md:mb-8 max-w-lg mx-auto">
                Join thousands of successful farmers. Get started today!
              </p>
              <Button
                asChild
                size="lg"
                className="bg-white text-primary hover:bg-white/90 h-11 md:h-12 px-6 md:px-8 text-sm md:text-base font-semibold shadow-lg"
              >
                <Link to="/products" className="flex items-center gap-2">
                  Browse Products
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
}
