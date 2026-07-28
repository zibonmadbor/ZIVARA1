<div align="center">

  <h1>✨ ZIVARA — Wear The Future</h1>
  <p><strong>A Luxury AI-Powered Fashion E-Commerce Platform with Interactive 3D Fitting Canvas & Real-Time AI Virtual Try-On</strong></p>

  <p>
    <a href="https://zivaraicloth.netlify.app/" target="_blank">
      <img src="https://img.shields.io/badge/🌐_Live_Demo-zivaraicloth.netlify.app-00C7B7?style=for-the-badge&logo=netlify&logoColor=white" alt="Live Demo" />
    </a>
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-18.3-61DAFB.svg?style=for-the-badge&logo=react&logoColor=black" alt="React 18" />
    <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6.svg?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Google_Gemini-AI_2.5-4285F4.svg?style=for-the-badge&logo=googlegemini&logoColor=white" alt="Google Gemini AI" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933.svg?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js Express" />
    <img src="https://img.shields.io/badge/MongoDB-Database-47A248.svg?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  </p>

  <br />

  <a href="https://zivaraicloth.netlify.app/" target="_blank">
    <img src="src/assets/ai-tryon-promo.jpg" alt="ZIVARA AI Virtual Try-On Showcase" width="90%" style="border-radius: 12px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);" />
  </a>

</div>

<br />

---

## 🌐 Live Website Demo

> 🚀 **Explore the Live Application:** [https://zivaraicloth.netlify.app/](https://zivaraicloth.netlify.app/)  
> 🎭 **Interactive Admin Panel Demo:** [https://zivaraicloth.netlify.app/admin](https://zivaraicloth.netlify.app/admin)

---

## 🌟 Project Overview

**ZIVARA** is an advanced, premium fashion e-commerce platform designed to bridge the gap between digital online shopping and physical fitting rooms. By integrating **Google Gemini Multimodal AI**, ZIVARA empowers users to upload a photo and instantly see how any garment or accessory fits them in real-time.

---

## ✨ Key Features & Architecture

### 🚀 1. Interactive 3D Canvas Hero Section (`WEAR THE FUTURE`)
The landing page opens with a custom-crafted **Interactive 3D Fit Canvas Hero Section**:
* **Scroll-Driven Animation:** Scrolling smoothly rotates and morphs high-resolution fashion frames in real-time.
* **Live AI HUD HUD Telemetry Overlay:** Real-time fitting telemetry indicators display body alignment, tension calculations, and mesh rendering status as the user scrolls.
* **Glassmorphic Hero Typography:** Features bold "WEAR THE FUTURE" branding with direct Virtual Try-On and Shop Collection call-to-action buttons.

---

### 🤖 2. Generative AI Virtual Try-On (Photo Try-On)
ZIVARA includes a dedicated **AI Virtual Try-On Studio** allowing customers to test clothing before buying:

#### 📸 How Photo Try-On Works:
1. **Garment Selection:** Choose any product from the catalog (Men, Women, Kids, or Wearable Accessories like Suits, Jackets, Dresses, Sunglasses, Handbags, Jewelry, Watches, and Belts).
2. **User Photo Upload:** Upload a personal photo or select from pre-configured model presets.
3. **Multimodal AI Processing:** The system sends both images to **Google Gemini 2.5 Vision AI** with specialized prompt engineering.
4. **Realistic Photorealistic Preview:** The AI realistically renders the item onto the user's photo—maintaining posture, body proportions, natural lighting, and fabric drape folds.
5. **Add to Cart & Checkout:** Preview the final generated image and add the product directly to the shopping cart.

---

### 🛍️ 3. Full E-Commerce Platform
* **50+ Products Catalog:** Men, Women, Kids, and Wearable Accessories.
* **Instant Search & Dynamic Filter:** Filter by category, price range, new arrivals, and flash sales.
* **Shopping Cart & Coupon Engine:** Real-time cart updates with dynamic coupon code validation.
* **Order Status Tracker:** Visual step-by-step order tracking timeline (Pending ➔ Confirmed ➔ Processing ➔ Shipped ➔ Delivered).
* **Role-Based Authentication:** Firebase Auth (Email/Password & Google Sign-In) synced with JWT MongoDB session security.

---

### ⚡ 4. Admin Management Dashboard
* **Analytics Overview:** Real-time sales, total orders, customer metrics, and revenue charts using Recharts.
* **Product & Category CRUD:** Manage products, categories, coupons, promotional banners, and orders.
* **Safe Portfolio Demo Mode:** Auto-detects static hosting (Netlify/Vercel) to safely simulate database operations without affecting live databases.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion |
| **3D & Canvas** | HTML5 Canvas API, Frame Preloading Engine |
| **AI Integration** | Google Gemini 2.5 Flash / Flash-Lite Vision API |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB & Mongoose ORM |
| **Authentication** | Firebase Authentication + JWT Verification |
| **Data & State** | React Context API, TanStack React Query v5 |

---

## 💻 Local Installation & Setup Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- Google Gemini API Key

```bash
# 1. Clone repo
git clone https://github.com/zibonmadbor/ZIVARA1.git
cd ZIVARA1

# 2. Install frontend dependencies
npm install

# 3. Install backend dependencies
cd server
npm install
cd ..

# 4. Start frontend & backend
# Terminal 1 (Frontend):
npm run dev

# Terminal 2 (Backend):
cd server && npm run dev
```

---

## 👥 Credits

- **Full-Stack Development:** Zibon Madber & Hafizur Rahman
- **Project Planning & Architecture:** Mahfuz Hossain

---

<div align="center">
  <p>ZIVARA — Wear the Future</p>
</div>
