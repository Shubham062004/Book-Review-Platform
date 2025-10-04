const express = require('express');
const { body } = require('express-validator');
const {
  getBookReviews,
  addReview,
  updateReview,
  deleteReview
} = require('../controllers/reviewController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules - FIXED
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Review text is required and must not exceed 500 characters'),
  body('bookId')
    .isMongoId()
    .withMessage('Valid book ID is required')
];

// Validation for edit (no bookId needed)
const reviewValidationForEdit = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Review text is required and must not exceed 500 characters')
];

// Debug middleware
router.use((req, res, next) => {
  console.log(`📝 Review Route: ${req.method} ${req.path}`);
  console.log('📝 Request body:', req.body);
  next();
});

// Add base route for /api/reviews
router.get('/', (req, res) => {
  res.json({ 
    message: 'Reviews API endpoint',
    endpoints: [
      'GET /api/reviews/:bookId - Get reviews for a book',
      'POST /api/reviews - Add a review (authenticated)',
      'PUT /api/reviews/:id - Update a review (authenticated)',
      'DELETE /api/reviews/:id - Delete a review (authenticated)'
    ]
  });
});

// Routes
router.get('/:bookId', getBookReviews);
router.post('/', authMiddleware, reviewValidation, addReview);
router.put('/:id', authMiddleware, reviewValidationForEdit, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;


