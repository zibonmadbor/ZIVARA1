// ============================================================
// ZIVARA PRODUCT CATALOG - 100% AUDITED & ACCURATE
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
    "name": "Deep Plum Purple Off-Shoulder Velvet Evening Gown",
    "slug": "deep-plum-purple-off-shoulder-velvet-evening-gown",
    "price": 349,
    "originalPrice": 420,
    "category": "women",
    "subcategory": "Dresses",
    "image": "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#800080",
      "#4A0E4E",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Elegant off-the-shoulder deep plum purple evening dress tailored with a structured sweetheart bodice and sleek silhouette.",
    "isNew": true,
    "isBestSeller": true,
    "rating": 5,
    "reviews": 182
  },
  {
    "id": "2",
    "name": "Classic Camel Tan Tailored Wool Blazer",
    "slug": "classic-camel-tan-tailored-wool-blazer",
    "price": 290,
    "category": "women",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#C2B280",
      "#D2B48C",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Double-breasted warm camel tan wool blazer with sharp notched lapels and flap pockets.",
    "isNew": true,
    "rating": 4.9,
    "reviews": 94
  },
  {
    "id": "3",
    "name": "Sunflower Yellow Floral Pattern Midi Slip Dress",
    "slug": "sunflower-yellow-floral-pattern-midi-slip-dress",
    "price": 220,
    "originalPrice": 260,
    "category": "women",
    "subcategory": "Dresses",
    "image": "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFD700",
      "#FFF8DC",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Vibrant sunflower yellow floral print slip dress featuring delicate spaghetti straps and a lightweight flowing drape.",
    "isSale": true,
    "rating": 4.8,
    "reviews": 140
  },
  {
    "id": "4",
    "name": "Scarlet Red Ruffled Tiered Cocktail Dress",
    "slug": "scarlet-red-ruffled-tiered-cocktail-dress",
    "price": 275,
    "category": "women",
    "subcategory": "Dresses",
    "image": "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#DC143C",
      "#800020"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Romantic scarlet red tiered summer cocktail dress with flutter sleeves and fitted smocked bodice.",
    "isBestSeller": true,
    "rating": 5,
    "reviews": 112
  },
  {
    "id": "5",
    "name": "Pastel Yellow High-Waist Wide-Leg Palazzo Pants",
    "slug": "pastel-yellow-high-waist-wide-leg-palazzo-pants",
    "price": 180,
    "category": "women",
    "subcategory": "Pants",
    "image": "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFFFE0",
      "#FAFAD2",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "High-rise tailored wide-leg trousers in pastel yellow fluid crepe silk with clean pleats.",
    "isNew": true,
    "rating": 4.7,
    "reviews": 76
  },
  {
    "id": "6",
    "name": "Mustard Yellow Minimalist Fitted Crop Top",
    "slug": "mustard-yellow-minimalist-fitted-crop-top",
    "price": 95,
    "category": "women",
    "subcategory": "Tops",
    "image": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFDB58",
      "#D4AF37",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Chic modern mustard yellow sleeveless crop top paired with high-waist styling.",
    "rating": 4.8,
    "reviews": 88
  },
  {
    "id": "7",
    "name": "Bohemian Floral Tiered Summer Beach Maxi Dress",
    "slug": "bohemian-floral-tiered-summer-beach-maxi-dress",
    "price": 210,
    "category": "women",
    "subcategory": "Dresses",
    "image": "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FAF0E6",
      "#D4AF37",
      "#87CEEB"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Airy bohemian printed maxi dress with lightweight tiered hem and natural floral prints.",
    "isBestSeller": true,
    "rating": 4.9,
    "reviews": 95
  },
  {
    "id": "8",
    "name": "Off-White Ribbed Knit Fitted Halter Top",
    "slug": "off-white-ribbed-knit-fitted-halter-top",
    "price": 79,
    "category": "women",
    "subcategory": "Tops",
    "image": "https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1551803091-e20673f15770?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFFFF0",
      "#F5F5DC",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Breathable ribbed knit off-white halter top with clean minimal lines and comfortable stretch.",
    "isNew": true,
    "rating": 4.8,
    "reviews": 45
  },
  {
    "id": "9",
    "name": "Classic Beige Minimalist Trench Coat",
    "slug": "classic-beige-minimalist-trench-coat",
    "price": 320,
    "category": "women",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#D2B48C",
      "#F5F5DC",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L"
    ],
    "description": "Water-repellent tailored beige trench coat with storm flap, belted waist, and wrist buckles.",
    "isSale": true,
    "rating": 4.8,
    "reviews": 64
  },
  {
    "id": "10",
    "name": "Light Blue High-Rise Straight Leg Jeans",
    "slug": "light-blue-high-rise-straight-leg-jeans",
    "price": 135,
    "category": "women",
    "subcategory": "Pants",
    "image": "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#87CEEB",
      "#4682B4",
      "#000080"
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
    "description": "Vintage washed light indigo denim straight-leg jeans with high-rise waist.",
    "rating": 4.7,
    "reviews": 112
  },
  {
    "id": "11",
    "name": "Traditional Golden Yellow & Red Zari Border Saree",
    "slug": "traditional-golden-yellow-red-zari-border-saree",
    "price": 240,
    "originalPrice": 290,
    "category": "women",
    "subcategory": "Sarees",
    "image": "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFD700",
      "#DC143C",
      "#800000"
    ],
    "sizes": [
      "Free Size"
    ],
    "description": "Traditional handloom silk saree in radiant golden yellow with intricate red and gold metallic zari pallu.",
    "isNew": true,
    "isBestSeller": true,
    "rating": 5,
    "reviews": 145
  },
  {
    "id": "12",
    "name": "Embroidered Maroon & Gold Festive Anarkali Kurti",
    "slug": "embroidered-maroon-gold-festive-anarkali-kurti",
    "price": 195,
    "category": "women",
    "subcategory": "Kurtis",
    "image": "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#800000",
      "#FFD700",
      "#000000"
    ],
    "sizes": [
      "XS",
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Flowing floor-length festive ethnic Kurti in rich deep maroon with handcrafted gold embroidery along the neckline.",
    "isSale": true,
    "rating": 4.9,
    "reviews": 98
  },
  {
    "id": "13",
    "name": "Vibrant Red & Gold Handloom Silk Saree",
    "slug": "vibrant-red-gold-handloom-silk-saree",
    "price": 210,
    "category": "women",
    "subcategory": "Sarees",
    "image": "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#DC143C",
      "#FFD700",
      "#800020"
    ],
    "sizes": [
      "Free Size"
    ],
    "description": "Classic crimson red handloom saree adorned with traditional temple weave and gleaming golden border.",
    "rating": 4.8,
    "reviews": 82
  },
  {
    "id": "14",
    "name": "Navy Blue Bespoke Formal Tuxedo with Black Shawl Lapels",
    "slug": "navy-blue-bespoke-formal-tuxedo-black-shawl-lapels",
    "price": 580,
    "originalPrice": 680,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000080",
      "#000000",
      "#FFFFFF"
    ],
    "sizes": [
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "description": "Handcrafted midnight navy formal tuxedo jacket with black grosgrain shawl collar and matching dress pants.",
    "isNew": true,
    "isBestSeller": true,
    "rating": 5,
    "reviews": 145
  },
  {
    "id": "15",
    "name": "Classic Black Double-Breasted Tailored Suit & Blazer",
    "slug": "classic-black-double-breasted-tailored-suit-blazer",
    "price": 490,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000000",
      "#FFFFFF",
      "#36454F"
    ],
    "sizes": [
      "38R",
      "40R",
      "42R",
      "44R"
    ],
    "description": "Sharp black double-breasted tailored blazer suit paired with crisp white dress shirt and pocket square.",
    "isBestSeller": true,
    "rating": 4.9,
    "reviews": 110
  },
  {
    "id": "16",
    "name": "Pure White Linen Long-Sleeve Casual Button Shirt",
    "slug": "pure-white-linen-long-sleeve-casual-button-shirt",
    "price": 125,
    "originalPrice": 150,
    "category": "men",
    "subcategory": "T-Shirts",
    "image": "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFFFFF",
      "#F5F5DC"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "description": "Relaxed breathable pure white linen long-sleeve button-up shirt with spread collar.",
    "isSale": true,
    "rating": 4.8,
    "reviews": 215
  },
  {
    "id": "17",
    "name": "Heavyweight Black Leather Asymmetric Biker Moto Jacket",
    "slug": "heavyweight-black-leather-asymmetric-biker-moto-jacket",
    "price": 540,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1521223890158-f9f7c3d5d504?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000000",
      "#2F4F4F"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "description": "Full-grain genuine black leather motorcycle jacket with silver hardware, snap lapels, and asymmetrical zip.",
    "isBestSeller": true,
    "rating": 5,
    "reviews": 320
  },
  {
    "id": "18",
    "name": "Tailored Navy Blue Two-Piece Suit & White Shirt",
    "slug": "tailored-navy-blue-two-piece-suit-white-shirt",
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
    "description": "Bespoke navy blue two-piece formal suit paired with a crisp white collared dress shirt and white pocket square.",
    "isNew": true,
    "rating": 4.9,
    "reviews": 105
  },
  {
    "id": "19",
    "name": "Vintage Washed Indigo Denim Trucker Jacket",
    "slug": "vintage-washed-indigo-denim-trucker-jacket",
    "price": 195,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#1E3F66",
      "#4682B4",
      "#000080"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL"
    ],
    "description": "Classic 100% cotton selvedge blue denim jacket with contrast stitching and chest pockets.",
    "rating": 4.8,
    "reviews": 115
  },
  {
    "id": "20",
    "name": "Classic Light Blue Oxford Cotton Dress Shirt",
    "slug": "classic-light-blue-oxford-cotton-dress-shirt",
    "price": 110,
    "category": "men",
    "subcategory": "T-Shirts",
    "image": "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#87CEEB",
      "#FFFFFF",
      "#4682B4"
    ],
    "sizes": [
      "S",
      "M",
      "L",
      "XL",
      "XXL"
    ],
    "description": "Tailored long-sleeve light blue Oxford cloth button-down shirt made of 100% organic cotton.",
    "rating": 4.9,
    "reviews": 130
  },
  {
    "id": "21",
    "name": "Charcoal Grey Shawl Collar Knit Wool Sweater",
    "slug": "charcoal-grey-shawl-collar-knit-wool-sweater",
    "price": 165,
    "originalPrice": 195,
    "category": "men",
    "subcategory": "Sweaters",
    "image": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#36454F",
      "#000000",
      "#808080"
    ],
    "sizes": [
      "38",
      "40",
      "42",
      "44",
      "46"
    ],
    "description": "Heavyweight textured wool knit pullover sweater in heathered charcoal grey with buttoned shawl collar.",
    "isNew": true,
    "isBestSeller": true,
    "rating": 5,
    "reviews": 162
  },
  {
    "id": "22",
    "name": "Camel Tan Wool Overcoat over Black Turtleneck",
    "slug": "camel-tan-wool-overcoat-over-black-turtleneck",
    "price": 490,
    "originalPrice": 560,
    "category": "men",
    "subcategory": "Jackets",
    "image": "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#C2B280",
      "#000000",
      "#36454F"
    ],
    "sizes": [
      "38R",
      "40R",
      "42R",
      "44R",
      "46R"
    ],
    "description": "Luxury Italian camel wool tailored long overcoat worn over a fitted black ribbed knit turtleneck.",
    "isNew": true,
    "rating": 4.9,
    "reviews": 190
  },
  {
    "id": "23",
    "name": "Black Quilted Chevron Leather Crossbody Bag",
    "slug": "black-quilted-chevron-leather-crossbody-bag",
    "price": 340,
    "category": "accessories",
    "subcategory": "Handbags",
    "image": "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#000000",
      "#FFD700"
    ],
    "sizes": [
      "One Size"
    ],
    "description": "Genuine black calfskin leather quilted handbag with gold-tone chain strap and front flap clasp.",
    "isBestSeller": true,
    "rating": 5,
    "reviews": 210
  },
  {
    "id": "24",
    "name": "Minimalist Rose Gold Mesh Strap Analog Watch",
    "slug": "minimalist-rose-gold-mesh-strap-analog-watch",
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
    "description": "Ultra-thin analog timepiece featuring rose gold-tone stainless steel casing and woven mesh strap.",
    "rating": 4.9,
    "reviews": 185
  },
  {
    "id": "25",
    "name": "Classic Gold Frame Polarized Aviator Sunglasses",
    "slug": "classic-gold-frame-polarized-aviator-sunglasses",
    "price": 135,
    "category": "accessories",
    "subcategory": "Sunglasses",
    "image": "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#FFD700",
      "#006400",
      "#000000"
    ],
    "sizes": [
      "One Size"
    ],
    "description": "Gold-tone metal frame aviator sunglasses with UV400 polarized dark green lenses.",
    "rating": 4.8,
    "reviews": 118
  },
  {
    "id": "26",
    "name": "Brown Italian Calfskin Leather Reversible Belt",
    "slug": "brown-italian-calfskin-leather-reversible-belt",
    "price": 75,
    "category": "accessories",
    "subcategory": "Belts",
    "image": "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&auto=format&fit=crop&q=80",
    "images": [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&auto=format&fit=crop&q=80"
    ],
    "colors": [
      "#8B4513",
      "#000000"
    ],
    "sizes": [
      "32",
      "34",
      "36",
      "38",
      "40"
    ],
    "description": "Handmade genuine leather dress belt with polished silver brushed buckle.",
    "isSale": true,
    "rating": 4.8,
    "reviews": 96
  }
];

export const categories = [
  { id: "men", name: "Men", image: "https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?w=800&auto=format&fit=crop&q=80" },
  { id: "women", name: "Women", image: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80" },
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
