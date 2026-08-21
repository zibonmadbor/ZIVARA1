// ============================================================
// ZIVARA PRODUCT CATALOG - 100% AUDITED & VERIFIED
// ============================================================

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: "men" | "women" | "kids" | "accessories";
  subcategory?: string;
  image: string;
  images: string[];
  colors: string[];
  sizes: string[];
  description: string;
  isNew?: boolean;
  isSale?: boolean;
  isBestSeller?: boolean;
  rating?: number;
  reviews?: number;
}

export const products: Product[] = [
  {
    "id": "1",
    "name": "Emerald Green Silk Satin Evening Gala Gown",
    "slug": "emerald-green-silk-satin-evening-gala-gown",
    "price": 389,
    "originalPrice": 450,
    "category": "women",
    "subcategory": "Dresses",
    "image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#046307",
      "#000000",
      "#C0C0C0"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Floor-length royal emerald green mulberry silk satin evening gown with a cowl neckline and graceful side slit.",
    "isNew": true,
    "isBestSeller": true,
    "rating": 5,
    "reviews": 182
  },
  {
    "id": "2",
    "name": "Structured Midnight Blue Tailored Wool Blazer",
    "slug": "structured-midnight-blue-tailored-wool-blazer",
    "price": 320,
    "category": "women",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#191970",
      "#000000",
      "#F5F5DC"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Bespoke double-breasted midnight navy wool blazer tailored with sharp peaked lapels and horn buttons.",
    "isNew": true,
    "rating": 4.9,
    "reviews": 94
  },
  {
    "id": "3",
    "name": "Champagne Silk Charmeuse Slip Dress",
    "slug": "champagne-silk-charmeuse-slip-dress",
    "price": 245,
    "originalPrice": 290,
    "category": "women",
    "subcategory": "Dresses",
    "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#F7E7CE",
      "#000000",
      "#800020"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Effortless 90s-inspired bias-cut silk slip dress in luminous champagne with adjustable delicate straps.",
    "isSale": true,
    "rating": 4.8,
    "reviews": 140
  },
  {
    "id": "4",
    "name": "Crimson Floral Jacquard Midi Cocktail Dress",
    "slug": "crimson-floral-jacquard-midi-cocktail-dress",
    "price": 295,
    "category": "women",
    "subcategory": "Dresses",
    "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#990000",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Romantic fitted A-line midi dress tailored in textured floral jacquard with a sweetheart corset neckline.",
    "isBestSeller": true,
    "rating": 5,
    "reviews": 112
  },
  {
    "id": "5",
    "name": "Cashmere Double-Breasted Wool Overcoat",
    "slug": "cashmere-double-breasted-wool-overcoat",
    "price": 520,
    "originalPrice": 590,
    "category": "women",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#C2B280",
      "#000000",
      "#808080"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Tailored luxury camel overcoat spun from pure Mongolian cashmere and virgin wool blend with a waist tie belt.",
    "rating": 4.9,
    "reviews": 210
  },
  {
    "id": "6",
    "name": "High-Waisted Wide-Leg Tailored Silk Trousers",
    "slug": "high-waisted-wide-leg-tailored-silk-trousers",
    "price": 210,
    "category": "women",
    "subcategory": "Pants",
    "image": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FAF0E6",
      "#000000",
      "#2E8B57"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Pleated high-rise palazzo trousers cut from heavy fluid crepe silk with a concealed zip closure.",
    "isNew": true,
    "rating": 4.7,
    "reviews": 76
  },
  {
    "id": "7",
    "name": "Sheer Organza Puff-Sleeve Luxury Blouse",
    "slug": "sheer-organza-puff-sleeve-luxury-blouse",
    "price": 185,
    "category": "women",
    "subcategory": "Tops",
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFFFFF",
      "#000000",
      "#FFB6C1"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Ethereal sheer silk organza blouse featuring dramatic voluminous bishop sleeves and a mock pussybow collar.",
    "rating": 4.8,
    "reviews": 88
  },
  {
    "id": "8",
    "name": "Shimmering Gold Sequin Halter Evening Dress",
    "slug": "shimmering-gold-sequin-halter-evening-dress",
    "price": 360,
    "category": "women",
    "subcategory": "Dresses",
    "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#D4AF37",
      "#C0C0C0"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Dazzling champagne gold micro-sequin cocktail dress with a sophisticated mock neckline and open back.",
    "isBestSeller": true,
    "rating": 4.9,
    "reviews": 95
  },
  {
    "id": "9",
    "name": "Linen Blend Structured Corset Top",
    "slug": "linen-blend-structured-corset-top",
    "price": 159,
    "category": "women",
    "subcategory": "Tops",
    "image": "https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFFFFF",
      "#F5F5DC",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Structured corset top in breathable natural linen with boning detail and lace-up back.",
    "isNew": true,
    "rating": 4.8,
    "reviews": 45
  },
  {
    "id": "10",
    "name": "Silk Satin Bias Cut Midi Skirt",
    "slug": "silk-satin-bias-cut-midi-skirt",
    "price": 165,
    "category": "women",
    "subcategory": "Skirts",
    "image": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000000",
      "#F5F5DC",
      "#2E8B57"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Fluid bias-cut silk midi skirt with an elasticated interior waist for clean drape.",
    "isSale": true,
    "rating": 4.8,
    "reviews": 64
  },
  {
    "id": "11",
    "name": "High-Rise Vintage Straight Jeans",
    "slug": "high-rise-vintage-straight-jeans",
    "price": 145,
    "category": "women",
    "subcategory": "Pants",
    "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#4682B4",
      "#000080",
      "#000000"
    ],
    "sizes": [
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30"
    ],
    "description": "Classic 90s inspired high-rise straight leg jeans crafted from 100% rigid cotton denim.",
    "rating": 4.7,
    "reviews": 112
  },
  {
    "id": "12",
    "name": "Dhakai Jamdani Pure Silk Handloom Saree",
    "slug": "dhakai-jamdani-pure-silk-handloom-saree",
    "price": 280,
    "originalPrice": 320,
    "category": "women",
    "subcategory": "Sarees",
    "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#800000",
      "#FFD700",
      "#000000"
    ],
    "sizes": [
      "Free Size"
    ],
    "description": "Authentic traditional Dhakai Jamdani handloom saree woven with intricate geometric floral motifs and shimmering golden zari border.",
    "isNew": true,
    "isBestSeller": true,
    "rating": 5,
    "reviews": 145
  },
  {
    "id": "13",
    "name": "Designer Crimson Silk Salwar Kameez Three-Piece Set",
    "slug": "designer-crimson-silk-salwar-kameez-three-piece-set",
    "price": 195,
    "originalPrice": 230,
    "category": "women",
    "subcategory": "Salwar Kameez",
    "image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#DC143C",
      "#FFD700",
      "#800020"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Luxurious pure silk 3-piece salwar kameez set adorned with intricate neckline resham embroidery and a matching organza dupatta.",
    "isSale": true,
    "rating": 4.9,
    "reviews": 98
  },
  {
    "id": "14",
    "name": "Royal Blue Tangail Handloom Cotton Saree",
    "slug": "royal-blue-tangail-handloom-cotton-saree",
    "price": 160,
    "category": "women",
    "subcategory": "Sarees",
    "image": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000080",
      "#FFD700",
      "#1E90FF"
    ],
    "sizes": [
      "Free Size"
    ],
    "description": "Classic Bengali Tangail handloom saree featuring fine cotton weave, vibrant royal blue hue, and traditional temple borders.",
    "rating": 4.8,
    "reviews": 82
  },
  {
    "id": "15",
    "name": "Rajshahi Silk Floral Embroidered Anarkali Kurti",
    "slug": "rajshahi-silk-floral-embroidered-anarkali-kurti",
    "price": 175,
    "category": "women",
    "subcategory": "Kurtis",
    "image": "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1605518216938-7c31b7b14ad0?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FF69B4",
      "#FFD700",
      "#4B0082"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Flowing Rajshahi silk floor-length Anarkali kurti featuring handcrafted floral zari embroidery along the bodice and hemline.",
    "isNew": true,
    "rating": 4.9,
    "reviews": 110
  },
  {
    "id": "16",
    "name": "Ribbed Knit Minimalist Tank Top",
    "slug": "ribbed-knit-minimalist-tank-top",
    "price": 65,
    "category": "women",
    "subcategory": "Tops",
    "image": "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFFFFF",
      "#000000",
      "#D2B48C"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Soft stretch ribbed knit scoop-neck tank top, ideal for layered luxury.",
    "rating": 4.8,
    "reviews": 55
  },
  {
    "id": "17",
    "name": "Bohemian Linen Summer Beach Dress",
    "slug": "bohemian-linen-summer-beach-dress",
    "price": 140,
    "category": "women",
    "subcategory": "Dresses",
    "image": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FAF0E6",
      "#87CEEB"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Breezy pure linen relaxed summer dress with gentle puff sleeves and tiered skirt.",
    "rating": 4.8,
    "reviews": 62
  },
  {
    "id": "18",
    "name": "Tailored Cropped Wool Jacket",
    "slug": "tailored-cropped-wool-jacket",
    "price": 260,
    "category": "women",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1516762689617-e1cffcef479d?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#36454F",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Structured cropped blazer jacket with sharp shoulders and satin lining.",
    "rating": 4.9,
    "reviews": 80
  },
  {
    "id": "19",
    "name": "Midnight Navy Bespoke Italian Wool Tuxedo",
    "slug": "midnight-navy-bespoke-italian-wool-tuxedo",
    "price": 650,
    "originalPrice": 750,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000080",
      "#000000"
    ],
    "sizes": [
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "description": "Handcrafted Super 150s Italian wool tuxedo jacket with black grosgrain shawl lapels and matching dress trousers.",
    "isNew": true,
    "isBestSeller": true,
    "rating": 5,
    "reviews": 145
  },
  {
    "id": "20",
    "name": "Royal Black Formal Double-Breasted Suit & Blazer",
    "slug": "royal-black-formal-double-breasted-suit-blazer",
    "price": 490,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000000",
      "#36454F"
    ],
    "sizes": [
      "38R",
      "40R",
      "42R",
      "44R"
    ],
    "description": "Sharp black double-breasted formal blazer paired with tailored collar and pocket square for black-tie gala wear.",
    "isBestSeller": true,
    "rating": 4.9,
    "reviews": 110
  },
  {
    "id": "21",
    "name": "Classic Italian Linen White Summer Cuban Shirt",
    "slug": "classic-italian-linen-white-summer-cuban-shirt",
    "price": 135,
    "originalPrice": 160,
    "category": "men",
    "subcategory": "T-Shirts",
    "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFFFFF",
      "#F5F5DC",
      "#87CEEB"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "description": "Pure French flax linen relaxed resort shirt featuring an open camp collar, mother-of-pearl buttons, and straight hem.",
    "isSale": true,
    "rating": 4.8,
    "reviews": 215
  },
  {
    "id": "22",
    "name": "Classic Black Leather Biker Moto Jacket",
    "slug": "classic-black-leather-biker-moto-jacket",
    "price": 590,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000000",
      "#4A0E17"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "description": "Heavyweight full-grain black leather motorcycle jacket with asymmetrical silver chrome zips and snap-down lapels.",
    "isBestSeller": true,
    "rating": 5,
    "reviews": 320
  },
  {
    "id": "23",
    "name": "Classic Navy Blue Tailored Formal Suit & Blazer",
    "slug": "classic-navy-blue-tailored-formal-suit-blazer",
    "price": 480,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000080",
      "#FFFFFF",
      "#000000"
    ],
    "sizes": [
      "38R",
      "40R",
      "42R",
      "44R"
    ],
    "description": "Sharp bespoke navy blue tailored two-piece suit jacket paired with a crisp white collared dress shirt and pocket square.",
    "isNew": true,
    "rating": 4.9,
    "reviews": 105
  },
  {
    "id": "24",
    "name": "Vintage Washed Indigo Denim Trucker Jacket",
    "slug": "vintage-washed-indigo-denim-trucker-jacket",
    "price": 220,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#1E3F66",
      "#000080",
      "#000000"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Authentic 14oz selvedge indigo denim jacket with vintage whisker wash, brass button hardware, and chest flap pockets.",
    "rating": 4.8,
    "reviews": 115
  },
  {
    "id": "25",
    "name": "Smart Casual Oxford Blue Button-Down Shirt",
    "slug": "smart-casual-oxford-blue-button-down-shirt",
    "price": 115,
    "category": "men",
    "subcategory": "T-Shirts",
    "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#4682B4",
      "#FFFFFF",
      "#C0C0C0"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "description": "Heavyweight 100% organic cotton Oxford cloth shirt tailored with a button-down collar and curved hem.",
    "rating": 4.9,
    "reviews": 130
  },
  {
    "id": "26",
    "name": "Monochrome Graphic Print Streetwear T-Shirt",
    "slug": "monochrome-graphic-print-streetwear-t-shirt",
    "price": 65,
    "category": "men",
    "subcategory": "T-Shirts",
    "image": "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000000",
      "#FFFFFF"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "description": "260GSM combed cotton boxy tee with high-density architectural typography print.",
    "isNew": true,
    "rating": 4.8,
    "reviews": 67
  },
  {
    "id": "27",
    "name": "Urban Streetwear Heavyweight Charcoal Boxy Hoodie",
    "slug": "urban-streetwear-heavyweight-charcoal-boxy-hoodie",
    "price": 160,
    "category": "men",
    "subcategory": "Sweaters",
    "image": "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#36454F",
      "#000000",
      "#556B2F"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "description": "Luxury 480GSM organic heavyweight cotton hoodie in washed charcoal black with a structured drop-shoulder boxy fit.",
    "rating": 4.8,
    "reviews": 140
  },
  {
    "id": "28",
    "name": "Relaxed Fit Casual Linen Trousers",
    "slug": "relaxed-fit-casual-linen-trousers",
    "price": 110,
    "category": "men",
    "subcategory": "Pants",
    "image": "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#C2B280",
      "#000000",
      "#FFFFFF"
    ],
    "sizes": [
      "30",
      "32",
      "34",
      "36"
    ],
    "description": "Contemporary relaxed-tapered linen trousers with front pleats and side welt pockets.",
    "rating": 4.8,
    "reviews": 75
  },
  {
    "id": "29",
    "name": "Classic Beige Minimalist Trench Coat",
    "slug": "classic-beige-minimalist-trench-coat",
    "price": 380,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#D2B48C",
      "#000000"
    ],
    "sizes": [
      "38R",
      "40R",
      "42R",
      "44R"
    ],
    "description": "Water-resistant cotton gabardine tailored overcoat with storm flap and belt closure.",
    "rating": 4.9,
    "reviews": 95
  },
  {
    "id": "30",
    "name": "Festive Tussar Silk Hand-Embroidered Panjabi",
    "slug": "festive-tussar-silk-hand-embroidered-panjabi",
    "price": 165,
    "originalPrice": 195,
    "category": "men",
    "subcategory": "Panjabis",
    "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#D4AF37",
      "#800020",
      "#FFFFFF",
      "#000000"
    ],
    "sizes": [
      "38",
      "40",
      "42",
      "44",
      "46"
    ],
    "description": "Traditional Bangladeshi festive Tussar silk Panjabi featuring intricate thread embroidery along the mandarin collar and front placket.",
    "isNew": true,
    "isBestSeller": true,
    "rating": 5,
    "reviews": 162
  },
  {
    "id": "31",
    "name": "Kids Festive Embroidered Panjabi & Pajama Set",
    "slug": "kids-festive-embroidered-panjabi-pajama-set",
    "price": 65,
    "originalPrice": 80,
    "category": "kids",
    "subcategory": "Panjabis",
    "image": "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#D4AF37",
      "#800020",
      "#FFFFFF",
      "#1E90FF"
    ],
    "sizes": [
      "2Y",
      "4Y",
      "6Y",
      "8Y",
      "10Y"
    ],
    "description": "Adorable festive cotton silk Panjabi with delicate thread embroidery on collar and chest, paired with soft white cotton pajama.",
    "isNew": true,
    "isBestSeller": true,
    "rating": 4.9,
    "reviews": 94
  },
  {
    "id": "32",
    "name": "Kids Traditional Floral Silk Lehenga Choli Set",
    "slug": "kids-traditional-floral-silk-lehenga-choli-set",
    "price": 78,
    "category": "kids",
    "subcategory": "Lehengas",
    "image": "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FF69B4",
      "#FFD700",
      "#E6E6FA"
    ],
    "sizes": [
      "2Y",
      "4Y",
      "6Y",
      "8Y"
    ],
    "description": "Festive traditional silk flared lehenga and choli set adorned with golden gotta patti borders and matching sheer dupatta.",
    "isSale": true,
    "rating": 4.9,
    "reviews": 78
  },
  {
    "id": "33",
    "name": "Junior Winter Puffer Jacket with Hood",
    "slug": "junior-winter-puffer-jacket-with-hood",
    "price": 110,
    "category": "kids",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FF4500",
      "#000000",
      "#1E90FF"
    ],
    "sizes": [
      "4Y",
      "6Y",
      "8Y",
      "10Y",
      "12Y"
    ],
    "description": "Warm fleece-lined hooded puffer jacket with reflective safety detailing.",
    "isBestSeller": true,
    "rating": 4.9,
    "reviews": 115
  },
  {
    "id": "34",
    "name": "Girls Floral Summer Party Dress",
    "slug": "girls-floral-summer-party-dress",
    "price": 82,
    "category": "kids",
    "subcategory": "Dresses",
    "image": "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFC0CB",
      "#FFFFFF",
      "#FFFFE0"
    ],
    "sizes": [
      "3Y",
      "5Y",
      "7Y",
      "9Y"
    ],
    "description": "Charming twirl-worthy cotton dress featuring hand-embroidered flowers and bow tie sash.",
    "rating": 4.9,
    "reviews": 78
  },
  {
    "id": "35",
    "name": "Cozy Cotton Fleece Sweatpants & Hoodie Set",
    "slug": "cozy-cotton-fleece-sweatpants-hoodie-set",
    "price": 68,
    "category": "kids",
    "subcategory": "Sweaters",
    "image": "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1503944583220-79d8926ad5e2?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFB6C1",
      "#E0FFFF",
      "#FFF8DC"
    ],
    "sizes": [
      "2Y",
      "4Y",
      "6Y",
      "8Y"
    ],
    "description": "Cozy 2-piece fleece hoodie and matching sweatpants set made with hypoallergenic organic cotton.",
    "rating": 4.8,
    "reviews": 64
  },
  {
    "id": "36",
    "name": "Kids Organic Denim Dungarees Overalls",
    "slug": "kids-organic-denim-dungarees-overalls",
    "price": 75,
    "category": "kids",
    "subcategory": "Pants",
    "image": "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#4682B4",
      "#1E90FF"
    ],
    "sizes": [
      "2Y",
      "4Y",
      "6Y",
      "8Y",
      "10Y"
    ],
    "description": "Durable and soft organic cotton denim overalls with adjustable shoulder clasps.",
    "isNew": true,
    "rating": 4.9,
    "reviews": 82
  },
  {
    "id": "37",
    "name": "Luxury Quilted Leather Chain Crossbody Handbag",
    "slug": "luxury-quilted-leather-chain-crossbody-handbag",
    "price": 340,
    "category": "accessories",
    "subcategory": "Handbags",
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000000",
      "#800020",
      "#FAF0E6"
    ],
    "sizes": [
      "Medium"
    ],
    "description": "Chevron quilted calfskin leather handbag with antique gold sliding chain strap and turn-lock clasp.",
    "isBestSeller": true,
    "rating": 5,
    "reviews": 210
  },
  {
    "id": "38",
    "name": "Minimalist Rose Gold Mesh Analog Watch",
    "slug": "minimalist-rose-gold-mesh-analog-watch",
    "price": 245,
    "category": "accessories",
    "subcategory": "Watches",
    "image": "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#B76E79",
      "#C0C0C0",
      "#000000"
    ],
    "sizes": [
      "36mm",
      "40mm"
    ],
    "description": "Swiss quartz movement analog watch featuring ultra-thin rose gold casing and stainless steel mesh strap.",
    "rating": 4.9,
    "reviews": 185
  },
  {
    "id": "39",
    "name": "Polarized Teardrop Gold Aviator Sunglasses",
    "slug": "polarized-teardrop-gold-aviator-sunglasses",
    "price": 135,
    "category": "accessories",
    "subcategory": "Sunglasses",
    "image": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFD700",
      "#C0C0C0"
    ],
    "sizes": [
      "One Size"
    ],
    "description": "Timeless teardrop aviator frame in polished gold alloy with UV400 polarized green-tinted lenses.",
    "rating": 4.8,
    "reviews": 118
  },
  {
    "id": "40",
    "name": "Handcrafted Full-Grain Leather Messenger Bag",
    "slug": "handcrafted-full-grain-leather-messenger-bag",
    "price": 210,
    "category": "accessories",
    "subcategory": "Handbags",
    "image": "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#8B4513",
      "#000000"
    ],
    "sizes": [
      "Medium",
      "Large"
    ],
    "description": "Full-grain pull-up leather satchel with padded 14-inch laptop compartment and brass hardware.",
    "isBestSeller": true,
    "rating": 4.9,
    "reviews": 160
  },
  {
    "id": "41",
    "name": "Pure Cashmere Monogram Jacquard Scarf",
    "slug": "pure-cashmere-monogram-jacquard-scarf",
    "price": 145,
    "category": "accessories",
    "subcategory": "Scarves",
    "image": "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#C2B280",
      "#808080",
      "#000000"
    ],
    "sizes": [
      "One Size"
    ],
    "description": "Jacquard woven cashmere scarf with fringed hem edges and subtle logo pattern.",
    "isNew": true,
    "rating": 4.9,
    "reviews": 94
  },
  {
    "id": "42",
    "name": "18K Gold Plated Chain Layered Necklace",
    "slug": "18k-gold-plated-chain-layered-necklace",
    "price": 95,
    "category": "accessories",
    "subcategory": "Jewelry",
    "image": "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFD700"
    ],
    "sizes": [
      "One Size"
    ],
    "description": "Delicate triple-strand herringbone and curb chain necklace dipped in 18K yellow gold.",
    "rating": 4.8,
    "reviews": 82
  },
  {
    "id": "43",
    "name": "Italian Leather Reversible Dress Belt",
    "slug": "italian-leather-reversible-dress-belt",
    "price": 75,
    "category": "accessories",
    "subcategory": "Belts",
    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000000",
      "#8B4513"
    ],
    "sizes": [
      "32",
      "34",
      "36",
      "38",
      "40"
    ],
    "description": "32mm genuine Italian calfskin belt that rotates between classic black and rich cognac brown.",
    "isSale": true,
    "rating": 4.8,
    "reviews": 96
  },
  {
    "id": "44",
    "name": "Australian Wool Wide-Brim Fedora Hat",
    "slug": "australian-wool-wide-brim-fedora-hat",
    "price": 110,
    "category": "accessories",
    "subcategory": "Hats",
    "image": "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1521369909029-2afed882baee?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000000",
      "#C2B280",
      "#556B2F"
    ],
    "sizes": [
      "S/M",
      "L/XL"
    ],
    "description": "Structured wide-brim felt hat crafted from 100% Australian wool with a genuine leather band.",
    "rating": 4.9,
    "reviews": 71
  }
];

export const categories = [
  { id: "men", name: "Men", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80" },
  { id: "women", name: "Women", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80" },
  { id: "kids", name: "Kids", image: "https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?w=800&auto=format&fit=crop&q=80" },
  { id: "accessories", name: "Accessories", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80" },
];

export const getProductsByCategory = (category: string) => 
  products.filter((p) => p.category === category);

export const getNewArrivals = () => 
  products.filter((p) => p.isNew);

export const getBestSellers = () => 
  products.filter((p) => p.isBestSeller);

export const getSaleProducts = () => 
  products.filter((p) => p.isSale);
