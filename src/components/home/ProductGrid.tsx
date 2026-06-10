import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag, Eye, Star } from "lucide-react";

interface Product {
  id: string;
  _id?: string;
  name: string;
  slug: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory: string;
  image: string;
  images: string[];
  colors: string[];
  sizes: string[];
  description?: string;
  isNew: boolean;
  isBestSeller: boolean;
  isSale: boolean;
  rating: number;
  reviews: number;
}

interface ProductGridProps {
  title: string;
  subtitle?: string;
  filter?: "all" | "new" | "best" | "sale";
  limit?: number;
  showViewAll?: boolean;
}

export default function ProductGrid({
  title,
  subtitle,
  filter = "all",
  limit = 6,
  showViewAll = true,
}: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/products");
        if (res.ok) {
          const data = await res.json();
          const mapped: Product[] = data.map((p: any) => ({
            ...p,
            id: p._id || p.id,
          }));
          setProducts(mapped);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  let displayProducts = [...products];

  if (filter === "new") {
    displayProducts = displayProducts.filter((p) => p.isNew);
  } else if (filter === "best") {
    displayProducts = displayProducts.filter((p) => p.isBestSeller);
  } else if (filter === "sale") {
    displayProducts = displayProducts.filter((p) => p.isSale);
  }

  displayProducts = displayProducts.slice(0, limit);

  if (isLoading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-premium">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              {subtitle && (
                <span className="text-sm font-medium tracking-widest text-primary uppercase">
                  {subtitle}
                </span>
              )}
              <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-2">
                {title}
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(limit)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-muted rounded-lg mb-4" />
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-12"
        >
          <div>
            <span className="text-sm font-medium tracking-widest text-primary uppercase">
              {subtitle}
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-2">
              {title}
            </h2>
          </div>
          {showViewAll && (
            <Link
              to="/products"
              className="mt-4 md:mt-0 text-sm font-medium tracking-widest text-foreground/70 hover:text-primary transition-colors uppercase animated-underline"
            >
              View All
            </Link>
          )}
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group"
    >
      <Link to={`/product/${product.slug}`} className="block">
        <div className="card-product relative aspect-[3/4] mb-4 overflow-hidden rounded-lg">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          
          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium uppercase tracking-wider">
                New
              </span>
            )}
            {product.isSale && (
              <span className="px-3 py-1 bg-destructive text-destructive-foreground text-xs font-medium uppercase tracking-wider">
                Sale
              </span>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Add to wishlist"
            >
              <Heart className="w-4 h-4" />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-background/90 backdrop-blur-sm text-foreground hover:bg-primary hover:text-primary-foreground transition-colors"
              aria-label="Quick view"
            >
              <Eye className="w-4 h-4" />
            </motion.button>
          </div>

          {/* Add to Cart Button */}
          <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <button className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground font-medium text-sm uppercase tracking-wider hover:bg-primary/90 transition-colors">
              <ShoppingBag className="w-4 h-4" />
              Add to Cart
            </button>
          </div>
        </div>

        {/* Product Info */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${
                  i < Math.floor(product.rating)
                    ? "fill-primary text-primary"
                    : "fill-muted text-muted"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({product.reviews})
            </span>
          </div>
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-lg font-semibold text-foreground">
              ${product.price}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice}
              </span>
            )}
          </div>
          {/* Color Options */}
          <div className="flex items-center gap-2 mt-3">
            {product.colors.slice(0, 4).map((color, i) => (
              <span
                key={i}
                className="w-4 h-4 rounded-full border border-border"
                title={color}
              />
            ))}
            {product.colors.length > 4 && (
              <span className="text-xs text-muted-foreground">
                +{product.colors.length - 4}
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
