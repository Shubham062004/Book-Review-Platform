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

// Validation rules
const reviewValidation = [
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('reviewText')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Review text is required and must not exceed 500 characters'),
  body('bookId')
    .optional()
    .isMongoId()
    .withMessage('Invalid book ID')
];

// Routes
router.get('/:bookId', getBookReviews);
router.post('/', authMiddleware, reviewValidation, addReview);
router.put('/:id', authMiddleware, reviewValidation, updateReview);
router.delete('/:id', authMiddleware, deleteReview);

module.exports = router;


