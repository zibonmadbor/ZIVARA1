const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');

const products = [
  // ==================== MEN (17 products) ====================
  {
    name: "Noir Classic Tailored Blazer",
    slug: "noir-classic-tailored-blazer",
    price: 189.99,
    originalPrice: 249.99,
    category: "men",
    subcategory: "Blazers",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
    ],
    colors: ["Black", "Navy", "Charcoal"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "A timeless tailored blazer crafted from premium Italian wool blend. Features a slim-fit silhouette with notch lapels and a two-button closure. Perfect for formal events and business meetings.",
    isNew: false,
    isBestSeller: true,
    isSale: true,
    rating: 4.8,
    reviews: 234
  },
  {
    name: "Urban Flex Denim Jacket",
    slug: "urban-flex-denim-jacket",
    price: 129.99,
    originalPrice: 159.99,
    category: "men",
    subcategory: "Jackets",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80"
    ],
    colors: ["Indigo", "Light Wash", "Black"],
    sizes: ["S", "M", "L", "XL"],
    description: "Modern denim jacket with stretch technology for ultimate comfort. Distressed detailing and brass hardware give it an authentic vintage feel.",
    isNew: true,
    isBestSeller: false,
    isSale: true,
    rating: 4.6,
    reviews: 187
  },
  {
    name: "Zenith Premium Cotton Polo",
    slug: "zenith-premium-cotton-polo",
    price: 59.99,
    category: "men",
    subcategory: "T-Shirts",
    image: "https://images.unsplash.com/photo-1625910513413-5fc421e0fd9e?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1625910513413-5fc421e0fd9e?w=600&q=80"
    ],
    colors: ["White", "Navy", "Forest Green", "Burgundy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Ultra-soft Pima cotton polo with a ribbed collar and two-button placket. Breathable and wrinkle-resistant for all-day comfort.",
    isNew: false,
    isBestSeller: true,
    isSale: false,
    rating: 4.7,
    reviews: 412
  },
  {
    name: "Stealth Runner Joggers",
    slug: "stealth-runner-joggers",
    price: 79.99,
    originalPrice: 99.99,
    category: "men",
    subcategory: "Pants",
    image: "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600&q=80"
    ],
    colors: ["Black", "Grey", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    description: "Technical joggers with tapered fit and zippered pockets. Moisture-wicking fabric keeps you comfortable during workouts or casual outings.",
    isNew: true,
    isBestSeller: false,
    isSale: true,
    rating: 4.5,
    reviews: 156
  },
  {
    name: "Heritage Slim Chinos",
    slug: "heritage-slim-chinos",
    price: 89.99,
    category: "men",
    subcategory: "Pants",
    image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=600&q=80"
    ],
    colors: ["Khaki", "Navy", "Stone", "Olive"],
    sizes: ["28", "30", "32", "34", "36"],
    description: "Classic slim-fit chinos in stretch cotton twill. Perfect for smart-casual looks with a clean, modern silhouette.",
    isNew: false,
    isBestSeller: true,
    isSale: false,
    rating: 4.6,
    reviews: 328
  },
  {
    name: "Apex Graphic Crew Tee",
    slug: "apex-graphic-crew-tee",
    price: 39.99,
    category: "men",
    subcategory: "T-Shirts",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80"
    ],
    colors: ["White", "Black", "Heather Grey"],
    sizes: ["S", "M", "L", "XL"],
    description: "Premium heavyweight cotton tee with minimalist chest graphic. Relaxed fit with reinforced seams for durability.",
    isNew: true,
    isBestSeller: false,
    isSale: false,
    rating: 4.4,
    reviews: 89
  },
  {
    name: "Velocity Track Hoodie",
    slug: "velocity-track-hoodie",
    price: 99.99,
    originalPrice: 129.99,
    category: "men",
    subcategory: "Hoodies",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80"
    ],
    colors: ["Black", "Grey Marl", "Navy"],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Tech-fleece hoodie with ergonomic hood and kangaroo pocket. Perfect for layering or standalone streetwear looks.",
    isNew: false,
    isBestSeller: true,
    isSale: true,
    rating: 4.9,
    reviews: 567
  },
  {
    name: "Artisan Oxford Dress Shirt",
    slug: "artisan-oxford-dress-shirt",
    price: 74.99,
    category: "men",
    subcategory: "Shirts",
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&q=80"
    ],
    colors: ["White", "Light Blue", "Pink"],
    sizes: ["S", "M", "L", "XL"],
    description: "Crisp Oxford cloth button-down with a modern slim fit. Crafted from long-staple Egyptian cotton for exceptional softness.",
    isNew: false,
    isBestSeller: false,
    isSale: false,
    rating: 4.7,
    reviews: 201
  },
  {
    name: "Summit Puffer Vest",
    slug: "summit-puffer-vest",
    price: 119.99,
    originalPrice: 149.99,
    category: "men",
    subcategory: "Jackets",
    image: "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1608063615781-e2ef8c73d114?w=600&q=80"
    ],
    colors: ["Black", "Navy", "Olive"],
    sizes: ["S", "M", "L", "XL"],
    description: "Lightweight puffer vest with 700-fill power down insulation. Water-resistant shell with packable design for easy travel.",
    isNew: true,
    isBestSeller: false,
    isSale: true,
    rating: 4.5,
    reviews: 98
  },
  {
    name: "Metro Wool Overcoat",
    slug: "metro-wool-overcoat",
    price: 279.99,
    originalPrice: 349.99,
    category: "men",
    subcategory: "Jackets",
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600&q=80"
    ],
    colors: ["Camel", "Charcoal", "Black"],
    sizes: ["S", "M", "L", "XL"],
    description: "Luxurious double-breasted overcoat in Italian wool-cashmere blend. Notch lapels and a knee-length silhouette for timeless sophistication.",
    isNew: false,
    isBestSeller: true,
    isSale: true,
    rating: 4.9,
    reviews: 145
  },
  {
    name: "Drift Linen Summer Shirt",
    slug: "drift-linen-summer-shirt",
    price: 64.99,
    category: "men",
    subcategory: "Shirts",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80"
    ],
    colors: ["White", "Sky Blue", "Sage", "Sand"],
    sizes: ["S", "M", "L", "XL"],
    description: "Pure linen relaxed-fit shirt with a camp collar. Lightweight and breathable — designed for warm-weather elegance.",
    isNew: true,
    isBestSeller: false,
    isSale: false,
    rating: 4.3,
    reviews: 76
  },
  {
    name: "Forge Slim Selvedge Jeans",
    slug: "forge-slim-selvedge-jeans",
    price: 139.99,
    category: "men",
    subcategory: "Pants",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80"
    ],
    colors: ["Raw Indigo", "Black", "Stone Wash"],
    sizes: ["28", "30", "32", "34", "36"],
    description: "Japanese selvedge denim with a slim tapered leg. Features raw unwashed construction that develops unique fading over time.",
    isNew: false,
    isBestSeller: true,
    isSale: false,
    rating: 4.8,
    reviews: 389
  },
  {
    name: "Pulse Athletic Shorts",
    slug: "pulse-athletic-shorts",
    price: 44.99,
    category: "men",
    subcategory: "Shorts",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80"
    ],
    colors: ["Black", "Navy", "Grey"],
    sizes: ["S", "M", "L", "XL"],
    description: "Performance athletic shorts with built-in liner and 7-inch inseam. Quick-dry fabric with laser-cut ventilation.",
    isNew: true,
    isBestSeller: false,
    isSale: false,
    rating: 4.4,
    reviews: 112
  },
  {
    name: "Echo Merino Wool Sweater",
    slug: "echo-merino-wool-sweater",
    price: 109.99,
    originalPrice: 139.99,
    category: "men",
    subcategory: "Sweaters",
    image: "https://images.unsplash.com/photo-1614975059251-992f11792571?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1614975059251-992f11792571?w=600&q=80"
    ],
    colors: ["Charcoal", "Navy", "Burgundy", "Forest"],
    sizes: ["S", "M", "L", "XL"],
    description: "Extra-fine merino wool crewneck sweater. Naturally temperature-regulating and pill-resistant for season-after-season wear.",
    isNew: false,
    isBestSeller: false,
    isSale: true,
    rating: 4.7,
    reviews: 198
  },
  {
    name: "Cipher Tech Bomber Jacket",
    slug: "cipher-tech-bomber-jacket",
    price: 169.99,
    category: "men",
    subcategory: "Jackets",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"
    ],
    colors: ["Black", "Olive", "Navy"],
    sizes: ["S", "M", "L", "XL"],
    description: "Modern bomber jacket with a matte nylon shell and ribbed trim. Features hidden tech pockets and a satin-lined interior.",
    isNew: true,
    isBestSeller: false,
    isSale: false,
    rating: 4.6,
    reviews: 134
  },
  {
    name: "Vanguard Cargo Pants",
    slug: "vanguard-cargo-pants",
    price: 94.99,
    category: "men",
    subcategory: "Pants",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=600&q=80"
    ],
    colors: ["Olive", "Black", "Khaki"],
    sizes: ["S", "M", "L", "XL"],
    description: "Utilitarian cargo pants with a relaxed tapered fit. Six-pocket design with snap closures and adjustable ankle cuffs.",
    isNew: false,
    isBestSeller: false,
    isSale: false,
    rating: 4.3,
    reviews: 87
  },
  {
    name: "Prestige Cashmere Scarf",
    slug: "prestige-cashmere-scarf",
    price: 89.99,
    originalPrice: 119.99,
    category: "men",
    subcategory: "Accessories",
    image: "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=600&q=80"
    ],
    colors: ["Grey", "Camel", "Navy"],
    sizes: ["One Size"],
    description: "100% Mongolian cashmere scarf with fringe detailing. Incredibly soft and lightweight yet supremely warm.",
    isNew: false,
    isBestSeller: false,
    isSale: true,
    rating: 4.8,
    reviews: 67
  },

  // ==================== WOMEN (20 products) ====================
  {
    name: "Aurora Silk Wrap Dress",
    slug: "aurora-silk-wrap-dress",
    price: 199.99,
    originalPrice: 259.99,
    category: "women",
    subcategory: "Dresses",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&q=80"
    ],
    colors: ["Emerald", "Ruby", "Midnight Blue"],
    sizes: ["XS", "S", "M", "L"],
    description: "Elegant silk wrap dress with a flattering V-neckline and flutter sleeves. Flows beautifully from boardroom to cocktail hour.",
    isNew: false,
    isBestSeller: true,
    isSale: true,
    rating: 4.9,
    reviews: 456
  },
  {
    name: "Luna Cropped Leather Jacket",
    slug: "luna-cropped-leather-jacket",
    price: 249.99,
    category: "women",
    subcategory: "Jackets",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&q=80"
    ],
    colors: ["Black", "Cognac", "Burgundy"],
    sizes: ["XS", "S", "M", "L"],
    description: "Buttery-soft genuine leather jacket with an asymmetric zip and cropped hem. A wardrobe essential that only gets better with age.",
    isNew: true,
    isBestSeller: true,
    isSale: false,
    rating: 4.8,
    reviews: 312
  },
  {
    name: "Seraphina Floral Midi Skirt",
    slug: "seraphina-floral-midi-skirt",
    price: 79.99,
    originalPrice: 99.99,
    category: "women",
    subcategory: "Skirts",
    image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=600&q=80"
    ],
    colors: ["Blush Floral", "Navy Floral", "Black Botanical"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Flowing midi skirt in a romantic floral print. Features an elastic waistband and graceful A-line silhouette.",
    isNew: false,
    isBestSeller: false,
    isSale: true,
    rating: 4.5,
    reviews: 178
  },
  {
    name: "Celestia High-Waist Trousers",
    slug: "celestia-high-waist-trousers",
    price: 99.99,
    category: "women",
    subcategory: "Pants",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=600&q=80"
    ],
    colors: ["Black", "Camel", "Ivory"],
    sizes: ["XS", "S", "M", "L"],
    description: "Sophisticated high-waist wide-leg trousers with pressed creases. A polished look for the modern professional woman.",
    isNew: true,
    isBestSeller: false,
    isSale: false,
    rating: 4.6,
    reviews: 203
  },
  {
    name: "Velvet Bloom Cocktail Dress",
    slug: "velvet-bloom-cocktail-dress",
    price: 179.99,
    originalPrice: 229.99,
    category: "women",
    subcategory: "Dresses",
    image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=600&q=80"
    ],
    colors: ["Deep Plum", "Emerald", "Black"],
    sizes: ["XS", "S", "M", "L"],
    description: "Luxurious velvet cocktail dress with a fitted bodice and flared hem. Designed to make every entrance unforgettable.",
    isNew: false,
    isBestSeller: true,
    isSale: true,
    rating: 4.9,
    reviews: 287
  },
  {
    name: "Whisper Cashmere Cardigan",
    slug: "whisper-cashmere-cardigan",
    price: 159.99,
    category: "women",
    subcategory: "Sweaters",
    image: "https://images.unsplash.com/photo-1434389677669-e08b4cda3a90?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1434389677669-e08b4cda3a90?w=600&q=80"
    ],
    colors: ["Oatmeal", "Blush", "Grey", "Black"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "Cloud-soft cashmere cardigan with pearl buttons and ribbed trim. An effortlessly chic layering piece for any season.",
    isNew: false,
    isBestSeller: true,
    isSale: false,
    rating: 4.8,
    reviews: 534
  },
  {
    name: "Nova Structured Blazer",
    slug: "nova-structured-blazer",
    price: 149.99,
    originalPrice: 189.99,
    category: "women",
    subcategory: "Blazers",
    image: "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1548624313-0396c75e4b1a?w=600&q=80"
    ],
    colors: ["Black", "White", "Blush"],
    sizes: ["XS", "S", "M", "L"],
    description: "Sharp double-breasted blazer with gold-tone buttons and padded shoulders. Power dressing reimagined for the modern woman.",
    isNew: true,
    isBestSeller: false,
    isSale: true,
    rating: 4.7,
    reviews: 167
  },
  {
    name: "Aria Ribbed Bodysuit",
    slug: "aria-ribbed-bodysuit",
    price: 44.99,
    category: "women",
    subcategory: "Tops",
    image: "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600&q=80"
    ],
    colors: ["Black", "White", "Mocha", "Olive"],
    sizes: ["XS", "S", "M", "L"],
    description: "Form-fitting ribbed bodysuit with a square neckline and snap closure. The ultimate foundation piece for any outfit.",
    isNew: false,
    isBestSeller: false,
    isSale: false,
    rating: 4.4,
    reviews: 256
  },
  {
    name: "Solstice Linen Wide-Leg Pants",
    slug: "solstice-linen-wide-leg-pants",
    price: 84.99,
    category: "women",
    subcategory: "Pants",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&q=80"
    ],
    colors: ["Natural", "Black", "Sage"],
    sizes: ["XS", "S", "M", "L"],
    description: "Breezy linen wide-leg pants with a drawstring waist. Resort-ready style that transitions seamlessly into everyday wear.",
    isNew: true,
    isBestSeller: false,
    isSale: false,
    rating: 4.5,
    reviews: 143
  },
  {
    name: "Glow Satin Camisole",
    slug: "glow-satin-camisole",
    price: 49.99,
    originalPrice: 64.99,
    category: "women",
    subcategory: "Tops",
    image: "https://images.unsplash.com/photo-1564246544814-647abfba0f0a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1564246544814-647abfba0f0a?w=600&q=80"
    ],
    colors: ["Champagne", "Black", "Dusty Rose", "Ivory"],
    sizes: ["XS", "S", "M", "L"],
    description: "Luxe satin camisole with delicate lace trim and adjustable straps. Wear alone or layered under a blazer for effortless glamour.",
    isNew: false,
    isBestSeller: false,
    isSale: true,
    rating: 4.6,
    reviews: 189
  },
  {
    name: "Mirage Sequin Evening Gown",
    slug: "mirage-sequin-evening-gown",
    price: 349.99,
    originalPrice: 449.99,
    category: "women",
    subcategory: "Dresses",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&q=80"
    ],
    colors: ["Gold", "Silver", "Black"],
    sizes: ["XS", "S", "M", "L"],
    description: "Show-stopping floor-length gown with allover sequin embellishment. Features a dramatic side slit and open back for red-carpet glamour.",
    isNew: false,
    isBestSeller: true,
    isSale: true,
    rating: 5.0,
    reviews: 98
  },
  {
    name: "Zen Yoga Leggings",
    slug: "zen-yoga-leggings",
    price: 69.99,
    category: "women",
    subcategory: "Activewear",
    image: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600&q=80"
    ],
    colors: ["Black", "Midnight Blue", "Burgundy", "Forest"],
    sizes: ["XS", "S", "M", "L", "XL"],
    description: "High-waist sculpting leggings with four-way stretch and moisture-wicking technology. Hidden pocket at the waistband for essentials.",
    isNew: true,
    isBestSeller: true,
    isSale: false,
    rating: 4.8,
    reviews: 678
  },
  {
    name: "Cascade Ruffle Blouse",
    slug: "cascade-ruffle-blouse",
    price: 69.99,
    category: "women",
    subcategory: "Tops",
    image: "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=600&q=80"
    ],
    colors: ["Ivory", "Blush", "Lavender"],
    sizes: ["XS", "S", "M", "L"],
    description: "Romantic chiffon blouse with cascading ruffle detailing. A feminine statement piece that pairs beautifully with tailored pants or denim.",
    isNew: false,
    isBestSeller: false,
    isSale: false,
    rating: 4.5,
    reviews: 134
  },
  {
    name: "Prism Color-Block Sweater",
    slug: "prism-color-block-sweater",
    price: 89.99,
    originalPrice: 109.99,
    category: "women",
    subcategory: "Sweaters",
    image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=600&q=80"
    ],
    colors: ["Multi Warm", "Multi Cool", "Earth Tones"],
    sizes: ["XS", "S", "M", "L"],
    description: "Playful color-block sweater in soft cotton-acrylic blend. Oversized fit with dropped shoulders for a cozy, modern vibe.",
    isNew: true,
    isBestSeller: false,
    isSale: true,
    rating: 4.4,
    reviews: 112
  },
  {
    name: "Ivy Tailored Jumpsuit",
    slug: "ivy-tailored-jumpsuit",
    price: 139.99,
    category: "women",
    subcategory: "Jumpsuits",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80"
    ],
    colors: ["Black", "Navy", "Olive"],
    sizes: ["XS", "S", "M", "L"],
    description: "Sleek tailored jumpsuit with a cinched waist and wide legs. One piece, infinite style possibilities — from office to evening.",
    isNew: false,
    isBestSeller: true,
    isSale: false,
    rating: 4.7,
    reviews: 223
  },
  {
    name: "Crystal Embellished Clutch",
    slug: "crystal-embellished-clutch",
    price: 129.99,
    originalPrice: 169.99,
    category: "women",
    subcategory: "Accessories",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&q=80"
    ],
    colors: ["Silver", "Gold", "Rose Gold"],
    sizes: ["One Size"],
    description: "Stunning crystal-covered evening clutch with detachable chain strap. The perfect finishing touch for any glamorous occasion.",
    isNew: false,
    isBestSeller: false,
    isSale: true,
    rating: 4.6,
    reviews: 89
  },
  {
    name: "Breeze Oversized Denim Jacket",
    slug: "breeze-oversized-denim-jacket",
    price: 109.99,
    category: "women",
    subcategory: "Jackets",
    image: "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80"
    ],
    colors: ["Light Wash", "Medium Wash", "White"],
    sizes: ["XS", "S", "M", "L"],
    description: "Oversized boyfriend-style denim jacket with distressed detailing. A spring/fall layering staple that goes with everything.",
    isNew: true,
    isBestSeller: false,
    isSale: false,
    rating: 4.5,
    reviews: 167
  },
  {
    name: "Sienna Knit Midi Dress",
    slug: "sienna-knit-midi-dress",
    price: 119.99,
    category: "women",
    subcategory: "Dresses",
    image: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&q=80"
    ],
    colors: ["Camel", "Black", "Rust"],
    sizes: ["XS", "S", "M", "L"],
    description: "Elegant ribbed-knit midi dress that hugs the body in all the right places. Features a mock neck and side slit for refined sophistication.",
    isNew: false,
    isBestSeller: false,
    isSale: false,
    rating: 4.7,
    reviews: 198
  },
  {
    name: "Luxe Leather Tote Bag",
    slug: "luxe-leather-tote-bag",
    price: 189.99,
    originalPrice: 239.99,
    category: "women",
    subcategory: "Accessories",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80"
    ],
    colors: ["Tan", "Black", "Burgundy"],
    sizes: ["One Size"],
    description: "Full-grain leather tote with interior organizer pockets and magnetic snap closure. Spacious enough for a laptop yet timelessly elegant.",
    isNew: false,
    isBestSeller: true,
    isSale: true,
    rating: 4.8,
    reviews: 345
  },
  {
    name: "Opulence Pearl Drop Earrings",
    slug: "opulence-pearl-drop-earrings",
    price: 59.99,
    category: "women",
    subcategory: "Accessories",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80"
    ],
    colors: ["Gold/Pearl", "Silver/Pearl"],
    sizes: ["One Size"],
    description: "Freshwater pearl drop earrings set in 18K gold-plated sterling silver. Delicate, luminous, and perfect for everyday elegance.",
    isNew: true,
    isBestSeller: false,
    isSale: false,
    rating: 4.9,
    reviews: 56
  },

  // ==================== KIDS (13 products) ====================
  {
    name: "Rainbow Star Graphic Tee",
    slug: "rainbow-star-graphic-tee",
    price: 24.99,
    category: "kids",
    subcategory: "T-Shirts",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80"
    ],
    colors: ["White", "Pink", "Sky Blue"],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
    description: "Fun and colorful graphic tee with a rainbow star print. Made from 100% organic cotton that's gentle on sensitive skin.",
    isNew: true,
    isBestSeller: true,
    isSale: false,
    rating: 4.8,
    reviews: 234
  },
  {
    name: "Adventure Cargo Shorts",
    slug: "adventure-cargo-shorts",
    price: 29.99,
    originalPrice: 39.99,
    category: "kids",
    subcategory: "Shorts",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80"
    ],
    colors: ["Khaki", "Navy", "Olive"],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
    description: "Durable cargo shorts with elastic waistband and multiple pockets. Built for playground adventures and beyond.",
    isNew: false,
    isBestSeller: false,
    isSale: true,
    rating: 4.5,
    reviews: 156
  },
  {
    name: "Sparkle Tutu Dress",
    slug: "sparkle-tutu-dress",
    price: 49.99,
    category: "kids",
    subcategory: "Dresses",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80"
    ],
    colors: ["Pink", "Lavender", "Mint"],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
    description: "Dreamy tutu dress with glitter-infused tulle layers and a satin bodice. Perfect for parties, recitals, and everyday magic.",
    isNew: true,
    isBestSeller: true,
    isSale: false,
    rating: 4.9,
    reviews: 312
  },
  {
    name: "Junior Denim Overalls",
    slug: "junior-denim-overalls",
    price: 44.99,
    originalPrice: 54.99,
    category: "kids",
    subcategory: "Pants",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80"
    ],
    colors: ["Classic Blue", "Light Wash"],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
    description: "Classic denim overalls with adjustable straps and a front bib pocket. Timeless style for little trendsetters.",
    isNew: false,
    isBestSeller: false,
    isSale: true,
    rating: 4.6,
    reviews: 178
  },
  {
    name: "Cozy Bear Hoodie",
    slug: "cozy-bear-hoodie",
    price: 39.99,
    category: "kids",
    subcategory: "Hoodies",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80"
    ],
    colors: ["Brown", "Grey", "Pink"],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
    description: "Adorable hoodie with bear ear details on the hood. Super-soft fleece lining for warmth and cuddle-worthy comfort.",
    isNew: false,
    isBestSeller: true,
    isSale: false,
    rating: 4.8,
    reviews: 267
  },
  {
    name: "Mini Explorer Windbreaker",
    slug: "mini-explorer-windbreaker",
    price: 54.99,
    originalPrice: 69.99,
    category: "kids",
    subcategory: "Jackets",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80"
    ],
    colors: ["Yellow", "Red", "Blue"],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
    description: "Lightweight water-resistant windbreaker with a packable hood. Reflective details for visibility during outdoor play.",
    isNew: true,
    isBestSeller: false,
    isSale: true,
    rating: 4.5,
    reviews: 98
  },
  {
    name: "Dino Print Pajama Set",
    slug: "dino-print-pajama-set",
    price: 29.99,
    category: "kids",
    subcategory: "Sleepwear",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80"
    ],
    colors: ["Green", "Blue", "Grey"],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
    description: "Playful dinosaur-print pajama set in soft organic cotton. Snug-fit design for safe and comfortable sleeping.",
    isNew: false,
    isBestSeller: false,
    isSale: false,
    rating: 4.7,
    reviews: 189
  },
  {
    name: "Little Champ Sneakers",
    slug: "little-champ-sneakers",
    price: 49.99,
    originalPrice: 59.99,
    category: "kids",
    subcategory: "Shoes",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
    ],
    colors: ["White/Blue", "Black/Red", "Pink/White"],
    sizes: ["10C", "11C", "12C", "13C", "1Y", "2Y", "3Y"],
    description: "Lightweight velcro-strap sneakers with cushioned soles and breathable mesh uppers. Easy on, easy off for independent kids.",
    isNew: true,
    isBestSeller: true,
    isSale: true,
    rating: 4.6,
    reviews: 234
  },
  {
    name: "Starlight Princess Dress",
    slug: "starlight-princess-dress",
    price: 59.99,
    category: "kids",
    subcategory: "Dresses",
    image: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=600&q=80"
    ],
    colors: ["Gold", "Silver", "Rose"],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y"],
    description: "Enchanting princess dress with shimmering fabric and puff sleeves. Complete with a satin sash for a fairy-tale look.",
    isNew: false,
    isBestSeller: false,
    isSale: false,
    rating: 4.9,
    reviews: 156
  },
  {
    name: "Junior Varsity Bomber",
    slug: "junior-varsity-bomber",
    price: 64.99,
    originalPrice: 79.99,
    category: "kids",
    subcategory: "Jackets",
    image: "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=600&q=80"
    ],
    colors: ["Navy/White", "Black/Red", "Green/Gold"],
    sizes: ["5-6Y", "7-8Y", "9-10Y", "11-12Y"],
    description: "Cool varsity bomber jacket with contrast sleeves and embroidered patches. A sporty style statement for little athletes.",
    isNew: false,
    isBestSeller: false,
    isSale: true,
    rating: 4.5,
    reviews: 112
  },
  {
    name: "Sunny Day Romper",
    slug: "sunny-day-romper",
    price: 34.99,
    category: "kids",
    subcategory: "Rompers",
    image: "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80"
    ],
    colors: ["Sunshine Yellow", "Coral", "Sky Blue"],
    sizes: ["3-4Y", "5-6Y", "7-8Y"],
    description: "Cheerful one-piece romper with ruffled shoulders and elastic waist. Made from breathable cotton for hot summer days.",
    isNew: true,
    isBestSeller: false,
    isSale: false,
    rating: 4.4,
    reviews: 78
  },
  {
    name: "Cool Kids Graphic Sweatshirt",
    slug: "cool-kids-graphic-sweatshirt",
    price: 34.99,
    originalPrice: 44.99,
    category: "kids",
    subcategory: "Sweatshirts",
    image: "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1471286174890-9c112ffca5b4?w=600&q=80"
    ],
    colors: ["Heather Grey", "Navy", "Pink"],
    sizes: ["3-4Y", "5-6Y", "7-8Y", "9-10Y", "11-12Y"],
    description: "Statement graphic sweatshirt with bold typography and a brushed fleece interior. Comfortable, cool, and ready for school.",
    isNew: false,
    isBestSeller: false,
    isSale: true,
    rating: 4.6,
    reviews: 145
  },
  {
    name: "Twinkle Toes Ballet Flats",
    slug: "twinkle-toes-ballet-flats",
    price: 39.99,
    category: "kids",
    subcategory: "Shoes",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
    ],
    colors: ["Rose Gold", "Silver", "Black"],
    sizes: ["10C", "11C", "12C", "13C", "1Y", "2Y"],
    description: "Sparkly ballet flats with cushioned insoles and non-slip soles. Dressy enough for special occasions, comfy enough for all day.",
    isNew: false,
    isBestSeller: true,
    isSale: false,
    rating: 4.7,
    reviews: 198
  }
];

async function seedProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing products
    const deleted = await Product.deleteMany({});
    console.log(`Cleared ${deleted.deletedCount} existing products`);

    // Insert new products
    const inserted = await Product.insertMany(products);
    console.log(`\n✅ Successfully seeded ${inserted.length} products!\n`);

    // Summary
    const men = inserted.filter(p => p.category === 'men').length;
    const women = inserted.filter(p => p.category === 'women').length;
    const kids = inserted.filter(p => p.category === 'kids').length;
    console.log(`   👔 Men:   ${men} products`);
    console.log(`   👗 Women: ${women} products`);
    console.log(`   👶 Kids:  ${kids} products`);

    await mongoose.disconnect();
    console.log('\nDone!');
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
}

seedProducts();
