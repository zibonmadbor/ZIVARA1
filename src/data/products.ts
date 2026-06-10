import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import product5 from "@/assets/product-5.jpg";
import product6 from "@/assets/product-6.jpg";

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "men" | "women" | "kids";
  subcategory: string;
  image: string;
  images: string[];
  colors: string[];
  sizes: string[];
  description: string;
  isNew?: boolean;
  isBestSeller?: boolean;
  isSale?: boolean;
  rating: number;
  reviews: number;
}

export const products: Product[] = [
  {
    id: "1",
    name: "Essential Black Tee",
    price: 89,
    category: "men",
    subcategory: "T-Shirts",
    image: product1,
    images: [product1],
    colors: ["#000000", "#1a1a1a", "#333333"],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Premium organic cotton t-shirt with a relaxed fit. Features our signature invisible stitching and a subtle ZIVARA logo at the hem. The perfect foundation for any wardrobe.",
    isNew: true,
    rating: 4.9,
    reviews: 128,
  },
  {
    id: "2",
    name: "Silk Elegance Blouse",
    price: 249,
    originalPrice: 299,
    category: "women",
    subcategory: "Tops",
    image: product2,
    images: [product2],
    colors: ["#F5F5DC", "#FFF8E1", "#FFE4B5"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Luxurious 100% mulberry silk blouse with a mandarin collar. Delicate mother-of-pearl buttons and French seams. An investment piece that transcends seasons.",
    isSale: true,
    rating: 4.8,
    reviews: 89,
  },
  {
    id: "3",
    name: "Tailored Charcoal Blazer",
    price: 599,
    category: "men",
    subcategory: "Jackets",
    image: product3,
    images: [product3],
    colors: ["#36454F", "#2F4F4F", "#1C1C1C"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Impeccably crafted Italian wool blazer with half-canvas construction. Features working surgeon cuffs and a contemporary slim fit. The epitome of modern tailoring.",
    isBestSeller: true,
    rating: 4.9,
    reviews: 256,
  },
  {
    id: "4",
    name: "Golden Hour Gown",
    price: 899,
    category: "women",
    subcategory: "Dresses",
    image: product4,
    images: [product4],
    colors: ["#D4AF37", "#FFD700", "#B8860B"],
    sizes: ["XS", "S", "M", "L"],
    description: "Breathtaking floor-length gown in champagne gold silk satin. Features a flattering wrap silhouette and a dramatic train. Perfect for galas and special occasions.",
    isNew: true,
    isBestSeller: true,
    rating: 5.0,
    reviews: 67,
  },
  {
    id: "5",
    name: "Heritage Leather Jacket",
    price: 1299,
    originalPrice: 1499,
    category: "men",
    subcategory: "Jackets",
    image: product5,
    images: [product5],
    colors: ["#000000", "#3D2314"],
    sizes: ["S", "M", "L", "XL"],
    description: "Hand-crafted from the finest Italian lambskin leather. Features YKK hardware and a quilted satin lining. A timeless investment that gets better with age.",
    isSale: true,
    isBestSeller: true,
    rating: 4.9,
    reviews: 312,
  },
  {
    id: "6",
    name: "Little Luxe Collection Set",
    price: 189,
    category: "kids",
    subcategory: "Sets",
    image: product6,
    images: [product6],
    colors: ["#FFFDD0", "#000000"],
    sizes: ["2-3Y", "4-5Y", "6-7Y", "8-9Y"],
    description: "Adorable two-piece set featuring a cream blazer with gold buttons and a flowing tulle skirt. Perfect for special occasions and celebrations.",
    isNew: true,
    rating: 4.7,
    reviews: 45,
  },
];

export const categories = [
  { id: "men", name: "Men", image: "/placeholder.svg" },
  { id: "women", name: "Women", image: "/placeholder.svg" },
  { id: "kids", name: "Kids", image: "/placeholder.svg" },
];

export const getProductsByCategory = (category: string) => 
  products.filter((p) => p.category === category);

export const getNewArrivals = () => 
  products.filter((p) => p.isNew);

export const getBestSellers = () => 
  products.filter((p) => p.isBestSeller);

export const getSaleProducts = () => 
  products.filter((p) => p.isSale);
