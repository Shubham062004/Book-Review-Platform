const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Import routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');

// Load environment variables
dotenv.config();

const app = express();

// 🚀 ENHANCED CORS CONFIGURATION FOR VERCEL
const corsOptions = {
  origin: [
    // Local development
    'http://localhost:5173',
    'http://localhost:8080', 
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    
    // Vercel deployments (both current and future)
    'https://book-review-platform-oivm.vercel.app',
    'https://*.vercel.app',
    
    // Add your custom domains if any
    'https://book-review-frontend.vercel.app',
    
    // Render preview URLs
    'https://*.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type', 
    'Authorization', 
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  optionsSuccessStatus: 200, // For legacy browser support
  preflightContinue: false
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', cors(corsOptions));

// Additional CORS headers middleware
app.use((req, res, next) => {
  const origin = req.headers.origin;
  const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:8080',
    'http://localhost:3000',
    'https://book-review-platform-oivm.vercel.app',
    'https://book-review-frontend.vercel.app'
  ];
  
  if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(204);
    return;
  }
  
  next();
});

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware for debugging
app.use((req, res, next) => {
  console.log(`🌐 ${req.method} ${req.path} - Origin: ${req.headers.origin}`);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Book Review API is running!',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    allowedOrigins: [
      'https://book-review-platform-oivm.vercel.app',
      'Local development ports'
    ],
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      books: '/api/books',
      reviews: '/api/reviews',
      wishlist: '/api/wishlist'
    }
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'Book Review API is healthy!',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    cors: {
      enabled: true,
      origin: req.headers.origin || 'not-provided'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlist', wishlistRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: 'Route not found',
    requestedPath: req.originalUrl,
    method: req.method,
    availableRoutes: [
      'GET /',
      'GET /api/health',
      'POST /api/auth/signup',
      'POST /api/auth/login',
      'GET /api/books',
      'GET /api/books/:id',
      'GET /api/reviews/:bookId',
      'GET /api/wishlist',
      'POST /api/wishlist/:bookId'
    ]
  });
});

// Import database connection
const connectDB = require('./config/db');

// Connect to database and start server
const startServer = async () => {
  try {
    await connectDB();
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🔗 API Base URL: https://book-review-platform-no15.onrender.com`);
      console.log('🌐 CORS enabled for:');
      console.log('  - https://book-review-platform-oivm.vercel.app');
      console.log('  - localhost:5173');
      console.log(`✅ CORS configured for Vercel deployment`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();


