import { Product, Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'cat-1',
    name: 'Chicken Incubators',
    slug: 'chicken-incubators',
    description: 'Professional incubators for chicken eggs with automatic turning',
    iconUrl: '🐔',
    productCount: 12,
  },
  {
    id: 'cat-2',
    name: 'Duck & Goose',
    slug: 'duck-goose-incubators',
    description: 'Specialized incubators for waterfowl eggs',
    iconUrl: '🦆',
    productCount: 8,
  },
  {
    id: 'cat-3',
    name: 'Quail Incubators',
    slug: 'quail-incubators',
    description: 'Compact incubators perfect for quail eggs',
    iconUrl: '🐣',
    productCount: 10,
  },
  {
    id: 'cat-4',
    name: 'Industrial Units',
    slug: 'industrial-incubators',
    description: 'Large capacity incubators for commercial farms',
    iconUrl: '🏭',
    productCount: 6,
  },
  {
    id: 'cat-5',
    name: 'Accessories',
    slug: 'accessories',
    description: 'Egg trays, thermometers, hygrometers, and more',
    iconUrl: '🔧',
    productCount: 15,
  },
];

export const products: Product[] = [
  {
    id: 'prod-1',
    title: 'HatchMaster Pro 48 - Digital Egg Incubator',
    description: 'The HatchMaster Pro 48 is our best-selling automatic egg incubator, perfect for both beginners and experienced poultry farmers. Features precise digital temperature control, automatic egg turning every 2 hours, and built-in humidity control. The transparent viewing window lets you witness the miracle of hatching without disturbing the eggs. Suitable for chicken, duck, quail, and other poultry eggs.',
    shortDescription: 'Professional 48-egg incubator with automatic turning & digital controls',
    price: 12999,
    discountPercent: 15,
    finalPrice: 11049,
    stockQuantity: 50,
    category: categories[0],
    categoryId: 'cat-1',
    imagesUrls: [
      'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=800',
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800',
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400',
    rating: 4.8,
    reviewCount: 127,
    isFeatured: true,
    isNew: true,
    specifications: {
      'Capacity': '48 chicken eggs / 132 quail eggs',
      'Temperature Range': '30°C - 40°C (±0.1°C)',
      'Humidity Control': 'Built-in with digital display',
      'Egg Turning': 'Automatic every 2 hours',
      'Power': '80W, 220V AC',
      'Dimensions': '52 x 46 x 24 cm',
    },
    createdAt: '2024-01-15T10:00:00Z',
  },
  {
    id: 'prod-2',
    title: 'NestWarm Mini 12 - Home Incubator',
    description: 'Perfect starter incubator for educational purposes and small-scale hatching. The NestWarm Mini 12 is ideal for classrooms, hobbyists, and families who want to experience the joy of hatching. Compact design with LED candling light built-in.',
    shortDescription: 'Compact 12-egg incubator perfect for beginners',
    price: 4999,
    discountPercent: 0,
    finalPrice: 4999,
    stockQuantity: 120,
    category: categories[0],
    categoryId: 'cat-1',
    imagesUrls: [
      'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=800',
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400',
    rating: 4.6,
    reviewCount: 89,
    isFeatured: true,
    specifications: {
      'Capacity': '12 chicken eggs / 35 quail eggs',
      'Temperature Range': '35°C - 40°C',
      'Egg Turning': 'Manual (tray included)',
      'Power': '40W, 220V AC',
      'Weight': '1.8 kg',
    },
    createdAt: '2024-01-10T10:00:00Z',
  },
  {
    id: 'prod-3',
    title: 'AquaHatch 96 - Waterfowl Specialist',
    description: 'Designed specifically for duck, goose, and other waterfowl eggs. The AquaHatch 96 features enhanced humidity control essential for waterfowl eggs, larger egg compartments, and specialized turning angles. Includes misting system for optimal humidity.',
    shortDescription: 'Specialized incubator for duck & goose eggs',
    price: 18999,
    discountPercent: 20,
    finalPrice: 15199,
    stockQuantity: 35,
    category: categories[1],
    categoryId: 'cat-2',
    imagesUrls: [
      'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=800',
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=400',
    rating: 4.9,
    reviewCount: 203,
    isFeatured: true,
    isNew: true,
    specifications: {
      'Capacity': '96 duck eggs / 48 goose eggs',
      'Humidity Range': '40% - 80% RH',
      'Misting System': 'Automatic ultrasonic',
      'Egg Turning': 'Automatic 45° rotation',
      'Power': '150W, 220V AC',
    },
    createdAt: '2024-01-20T10:00:00Z',
  },
  {
    id: 'prod-4',
    title: 'QuailKing 200 - Compact Powerhouse',
    description: 'Specifically designed for quail eggs with specialized smaller egg trays. The QuailKing 200 maximizes hatching efficiency with precise temperature zones and optimized airflow for quail eggs.',
    shortDescription: 'High-capacity quail egg incubator',
    price: 8999,
    discountPercent: 10,
    finalPrice: 8099,
    stockQuantity: 45,
    category: categories[2],
    categoryId: 'cat-3',
    imagesUrls: [
      'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=800',
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1444212477490-ca407925329e?w=400',
    rating: 4.7,
    reviewCount: 156,
    isFeatured: false,
    specifications: {
      'Capacity': '200 quail eggs',
      'Temperature Accuracy': '±0.05°C',
      'Hatch Rate': 'Up to 98%',
      'Egg Turning': 'Automatic every hour',
      'Power': '60W, 220V AC',
    },
    createdAt: '2024-01-08T10:00:00Z',
  },
  {
    id: 'prod-5',
    title: 'FarmPro 500 - Commercial Incubator',
    description: 'Industrial-grade incubator for serious poultry farming operations. The FarmPro 500 features multiple temperature zones, industrial-grade components, and remote monitoring via smartphone app.',
    shortDescription: 'Industrial 500-egg capacity for commercial farms',
    price: 49999,
    discountPercent: 12,
    finalPrice: 43999,
    stockQuantity: 12,
    category: categories[3],
    categoryId: 'cat-4',
    imagesUrls: [
      'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=800',
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400',
    rating: 4.9,
    reviewCount: 67,
    isFeatured: true,
    specifications: {
      'Capacity': '500 chicken eggs',
      'Temperature Zones': '3 independent zones',
      'Smart Features': 'WiFi, App control, Alerts',
      'Backup Power': 'Battery backup included',
      'Warranty': '3 years commercial',
    },
    createdAt: '2024-01-05T10:00:00Z',
  },
  {
    id: 'prod-6',
    title: 'Digital Egg Candler - LED Pro',
    description: 'High-intensity LED egg candler for fertility checking and embryo development monitoring. Cool-touch design safe for handling multiple eggs. Works with all egg sizes from quail to goose.',
    shortDescription: 'Professional LED egg candling light',
    price: 1499,
    discountPercent: 0,
    finalPrice: 1499,
    stockQuantity: 200,
    category: categories[4],
    categoryId: 'cat-5',
    imagesUrls: [
      'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=800',
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400',
    rating: 4.5,
    reviewCount: 234,
    isFeatured: false,
    specifications: {
      'LED Power': '10W high-intensity',
      'Battery': 'Rechargeable, 8 hours',
      'Adapters': '4 sizes included',
      'Light Color': 'Cool white 6000K',
    },
    createdAt: '2024-01-12T10:00:00Z',
  },
  {
    id: 'prod-7',
    title: 'HatchMaster 24 - Compact Auto',
    description: 'The perfect balance of capacity and compactness. The HatchMaster 24 offers all the professional features of our Pro series in a more compact size, ideal for small farms and serious hobbyists.',
    shortDescription: '24-egg automatic incubator with full features',
    price: 7999,
    discountPercent: 15,
    finalPrice: 6799,
    stockQuantity: 75,
    category: categories[0],
    categoryId: 'cat-1',
    imagesUrls: [
      'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=800',
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1569288052389-dac9b0ac9eac?w=400',
    rating: 4.7,
    reviewCount: 178,
    isFeatured: true,
    isNew: true,
    specifications: {
      'Capacity': '24 chicken eggs / 66 quail eggs',
      'Temperature Range': '30°C - 40°C (±0.1°C)',
      'Humidity Control': 'Automatic with display',
      'Egg Turning': 'Automatic every 2 hours',
      'Power': '50W, 220V AC',
    },
    createdAt: '2024-01-18T10:00:00Z',
  },
  {
    id: 'prod-8',
    title: 'Precision Hygrometer & Thermometer',
    description: 'Wireless digital hygrometer and thermometer combo with external probe. Perfect for monitoring incubator conditions with high accuracy. Features min/max memory and alarm settings.',
    shortDescription: 'Digital temperature & humidity monitor',
    price: 899,
    discountPercent: 0,
    finalPrice: 899,
    stockQuantity: 300,
    category: categories[4],
    categoryId: 'cat-5',
    imagesUrls: [
      'https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=800',
    ],
    thumbnailUrl: 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=400',
    rating: 4.6,
    reviewCount: 312,
    isFeatured: false,
    specifications: {
      'Temp Range': '-20°C to 60°C (±0.5°C)',
      'Humidity Range': '10% - 99% RH (±3%)',
      'Display': 'Large LCD with backlight',
      'Probe Length': '1.5 meters',
    },
    createdAt: '2024-01-14T10:00:00Z',
  },
];

export const featuredProducts = products.filter((p) => p.isFeatured);
export const newProducts = products.filter((p) => p.isNew);

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}

export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter((p) => p.categoryId === categoryId);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(
    (p) =>
      p.title.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery) ||
      p.category.name.toLowerCase().includes(lowerQuery)
  );
}
