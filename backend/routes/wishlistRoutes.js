const express = require('express');
const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus
} = require('../controllers/wishlistController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`📋 Wishlist Route: ${req.method} ${req.path}`);
  next();
});

// All wishlist routes require authentication
router.use(authMiddleware);

// Routes
router.get('/', getWishlist);
router.post('/:bookId', addToWishlist);
router.delete('/:bookId', removeFromWishlist);
router.get('/check/:bookId', checkWishlistStatus);

module.exports = router;
