const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Allow dynamic Unsplash assets and React frontend
}));
app.use(cors());
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' })); // Support larger payloads for Base64 image transfers
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiters to prevent Brute-Force & Financial API Draining
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500, // Limit each IP to 500 requests per window
  message: { message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 Try-On generation requests per 15 mins to prevent API drain
  message: { message: 'AI Try-On request rate limit exceeded. Please wait a few minutes before trying again.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit login attempts to prevent brute force
  message: { message: 'Too many authentication attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api', globalLimiter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date(),
    uptime: process.uptime()
  });
});

// Register routes with targeted security limiters
app.use('/api/auth', authLimiter, require('./routes/auth'));
app.use('/api', require('./routes/products'));
app.use('/api', aiLimiter, require('./routes/ai'));
app.use('/api', require('./routes/sliders'));
app.use('/api', require('./routes/categories'));
app.use('/api', require('./routes/settings'));
app.use('/api/admin', require('./routes/adminUsers'));
app.use('/api/admin/dashboard', require('./routes/adminDashboard'));
app.use('/api/admin/coupons', require('./routes/coupons'));
app.use('/api/admin/reviews', require('./routes/reviews'));
app.use('/api/admin/notifications', require('./routes/notifications'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/coupons', require('./routes/couponsPublic'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled Server Error:', err.stack);
  res.status(500).json({
    message: 'An unexpected server error occurred',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

const PORT = process.env.PORT || 5000;

// Only listen when running locally, not on Vercel
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`ZIVARA Express Server running on port ${PORT}`);
  });
}

module.exports = app;
