<div align="center">
  <img src="https://via.placeholder.com/150x150.png?text=ZIVARA" alt="ZIVARA Logo" width="120" height="120" />
  <h1>ZIVARA — Wear the Future</h1>
  <p><strong>A Premium E-Commerce Platform with AI Virtual Try-On</strong></p>

  <p>
    <a href="https://github.com/your-username/zivara-wear-the-future/blob/main/LICENSE">
      <img src="https://img.shields.io/badge/License-MIT-blue.svg" alt="MIT License" />
    </a>
    <img src="https://img.shields.io/badge/React-18-61DAFB.svg?logo=react" alt="React" />
    <img src="https://img.shields.io/badge/Vite-5.0-646CFF.svg?logo=vite" alt="Vite" />
    <img src="https://img.shields.io/badge/Node.js-Express-339933.svg?logo=nodedotjs" alt="Express" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css" alt="Tailwind CSS" />
  </p>
</div>

<br />

## 🌟 About the Project

**ZIVARA** is a cutting-edge, premium fashion e-commerce platform designed to revolutionize the way people shop for clothes online. Built with a modern tech stack, ZIVARA combines high-end aesthetics with seamless performance, offering both a beautiful customer storefront and a powerful administrative dashboard.

### 🎯 Project Goal
Our primary goal is to bridge the gap between online shopping and physical fitting rooms. By integrating an **AI Virtual Try-On** feature, ZIVARA empowers customers to upload a photo and instantly see how a garment will look on them. This reduces return rates, increases buyer confidence, and provides an unparalleled, futuristic shopping experience.

---

## ✨ Key Features

### 🛍️ For Customers
* **Stunning Storefront:** A fast, responsive, and beautiful UI built with Tailwind CSS and Framer Motion.
* **AI Virtual Try-On:** Upload a photo and see a realistic digital preview of yourself wearing the selected item.
* **Smart Shopping Cart:** Real-time cart updates with dynamic coupon code validation.
* **Order Tracking:** Visual progress bars to track order delivery status (Pending, Processing, Shipped, Delivered).
* **Secure Authentication:** Powered by Firebase Authentication (Email/Password & Google Login).

### ⚙️ For Administrators
* **Comprehensive Dashboard:** Monitor sales, revenue, and recent orders at a glance.
* **Product Management:** Full CRUD operations for clothing items, sizes, colors, and stock.
* **Order Processing:** Update customer order statuses seamlessly.
* **Customization:** Manage website sliders, promotional banners, flash sales, and discount coupons.

---

## 🛠️ Technology Stack

| Category         | Technologies Used                                                                 |
| ---------------- | --------------------------------------------------------------------------------- |
| **Frontend**     | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Framer Motion, Lucide React  |
| **Backend**      | Node.js, Express.js                                                               |
| **Database**     | MongoDB (Mongoose)                                                                |
| **Auth**         | Firebase Authentication (JWT verified on backend)                                 |
| **State Mgt.**   | Context API (Cart & Auth), React Query                                            |
| **Routing**      | React Router DOM v6                                                               |

---

## 🚀 Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18+) and npm installed on your machine.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/zivara-wear-the-future.git
   cd zivara-wear-the-future
   ```

2. **Install Frontend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Backend Dependencies:**
   ```bash
   cd server
   npm install
   cd ..
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory (for frontend Firebase keys) and a `.env` file inside the `server/` directory (for MongoDB URI and backend secrets). *Note: Ensure `.env` is added to your `.gitignore`.*

5. **Run the Development Servers:**
   Open two terminal windows.
   
   *Terminal 1 (Backend):*
   ```bash
   cd server
   npm run dev
   ```
   
   *Terminal 2 (Frontend):*
   ```bash
   npm run dev
   ```

6. **Open the app:**
   Visit `http://localhost:8080` (or the port specified by Vite) in your browser.

---

## 👥 Credits & Team

* **Design and Development:** Jibon Madber & Hafizur Rahman
* **Planning and Strategy:** Mahafuj Hossain

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
