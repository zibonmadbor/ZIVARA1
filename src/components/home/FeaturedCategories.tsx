import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import hero1 from "@/assets/hero-1.jpg";
import hero2 from "@/assets/hero-2.jpg";
import hero3 from "@/assets/hero-3.jpg";

// Fallback categories if database is empty
const defaultCategories = [
  {
    id: "women",
    slug: "women",
    name: "Women",
    image: hero1,
    description: "Elegance redefined",
  },
  {
    id: "men",
    slug: "men",
    name: "Men",
    image: hero2,
    description: "Modern sophistication",
  },
  {
    id: "kids",
    slug: "kids",
    name: "Kids",
    image: hero3,
    description: "Future icons",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const },
  },
};

export default function FeaturedCategories() {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setCategories(data);
          } else {
            setCategories(defaultCategories);
          }
        } else {
          setCategories(defaultCategories);
        }
      } catch (err) {
        console.error("Failed to fetch categories", err);
        setCategories(defaultCategories);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  if (isLoading) {
    return (
      <section className="section-padding bg-background">
        <div className="container-premium text-center">
          <div className="w-12 h-12 rounded-full border-2 border-primary/20 border-t-primary animate-spin mx-auto" />
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="section-padding bg-background">
      <div className="container-premium">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-sm font-medium tracking-widest text-primary uppercase">
            Collections
          </span>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mt-4">
            Shop by Category
          </h2>
          <p className="text-muted-foreground mt-4 max-w-lg mx-auto">
            Discover our curated collections designed for every member of your family
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {categories.map((category) => (
            <motion.div key={category._id || category.id} variants={itemVariants}>
              <Link
                to={`/products?category=${category.slug}`}
                className="group block relative h-[500px] md:h-[600px] overflow-hidden rounded-lg"
              >
                <div className="absolute inset-0">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-500" />
                </div>
                <div className="absolute inset-0 flex flex-col items-center justify-end p-8 text-center">
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2">
                      {category.name}
                    </h3>
                    {category.description && (
                      <p className="text-foreground/70 mb-6">{category.description}</p>
                    )}
                    <span className="inline-block text-sm font-medium tracking-widest text-primary uppercase border-b-2 border-primary pb-1 group-hover:border-primary/50 transition-colors">
                      Explore Collection
                    </span>
                  </motion.div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
