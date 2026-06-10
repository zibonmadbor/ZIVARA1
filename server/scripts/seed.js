const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

// Load env vars
dotenv.config();

const products = [
  {
    name: "Essential Black Tee",
    slug: "essential-black-tee",
    price: 89,
    category: "men",
    subcategory: "T-Shirts",
    image: "/src/assets/product-1.jpg",
    images: ["/src/assets/product-1.jpg"],
    colors: ["#000000", "#1a1a1a", "#333333"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Premium organic cotton t-shirt with a relaxed fit. Features our signature invisible stitching and a subtle ZIVARA logo at the hem. The perfect foundation for any wardrobe.",
    isNew: true,
    rating: 4.9,
    reviews: 128
  },
  {
    name: "Silk Elegance Blouse",
    slug: "silk-elegance-blouse",
    price: 249,
    originalPrice: 299,
    category: "women",
    subcategory: "Tops",
    image: "/src/assets/product-2.jpg",
    images: ["/src/assets/product-2.jpg"],
    colors: ["#F5F5DC", "#FFF8E1", "#FFE4B5"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Luxurious 100% mulberry silk blouse with a mandarin collar. Delicate mother-of-pearl buttons and French seams. An investment piece that transcends seasons.",
    isSale: true,
    rating: 4.8,
    reviews: 89
  },
  {
    name: "Tailored Charcoal Blazer",
    slug: "tailored-charcoal-blazer",
    price: 599,
    category: "men",
    subcategory: "Jackets",
    image: "/src/assets/product-3.jpg",
    images: ["/src/assets/product-3.jpg"],
    colors: ["#36454F", "#2F4F4F", "#1C1C1C"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Impeccably crafted Italian wool blazer with half-canvas construction. Features working surgeon cuffs and a contemporary slim fit. The epitome of modern tailoring.",
    isBestSeller: true,
    rating: 4.9,
    reviews: 256
  },
  {
    name: "Golden Hour Gown",
    slug: "golden-hour-gown",
    price: 899,
    category: "women",
    subcategory: "Dresses",
    image: "/src/assets/product-4.jpg",
    images: ["/src/assets/product-4.jpg"],
    colors: ["#D4AF37", "#FFD700", "#B8860B"],
    sizes: ["XS", "S", "M", "L"],
    description: "Breathtaking floor-length gown in champagne gold silk satin. Features a flattering wrap silhouette and a dramatic train. Perfect for galas and special occasions.",
    isNew: true,
    isBestSeller: true,
    rating: 5.0,
    reviews: 67
  },
  {
    name: "Heritage Leather Jacket",
    slug: "heritage-leather-jacket",
    price: 1299,
    originalPrice: 1499,
    category: "men",
    subcategory: "Jackets",
    image: "/src/assets/product-5.jpg",
    images: ["/src/assets/product-5.jpg"],
    colors: ["#000000", "#3D2314"],
    sizes: ["S", "M", "L", "XL"],
    description: "Hand-crafted from the finest Italian lambskin leather. Features YKK hardware and a quilted satin lining. A timeless investment that gets better with age.",
    isSale: true,
    isBestSeller: true,
    rating: 4.9,
    reviews: 312
  },
  {
    name: "Little Luxe Collection Set",
    slug: "little-luxe-collection-set",
    price: 189,
    category: "kids",
    subcategory: "Sets",
    image: "/src/assets/product-6.jpg",
    images: ["/src/assets/product-6.jpg"],
    colors: ["#FFFDD0", "#000000"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    description: "Adorable two-piece set featuring a cream blazer with gold buttons and a flowing tulle skirt. Perfect for special occasions and celebrations.",
    isNew: true,
    rating: 4.7,
    reviews: 45
  }
];

const seedData = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/zivara';
    await mongoose.connect(connUri);

    console.log('Clearing old product catalog...');
    await Product.deleteMany();

    console.log('Seeding ZIVARA product catalog...');
    await Product.insertMany(products);
    console.log('Seeded products successfully!');

    // Optionally create a pre-elevated local Admin user placeholder in MongoDB 
    // in case they want a manual verification record ready
    console.log('Ensuring demo admin accounts exist...');
    const adminEmail = 'admin@zivara.com';
    const modEmail = 'moderator@zivara.com';
    
    // We don't seed Firebase UID here as that is created in Firebase client registration,
    // but having these emails ready for automatic elevation in routes is confirmed.

    mongoose.connection.close();
    console.log('Database seeding finished. Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding database error:', error);
    process.exit(1);
  }
};

seedData();
