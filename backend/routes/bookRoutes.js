const express = require('express');
const { body } = require('express-validator');
const {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
} = require('../controllers/bookController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Validation rules
const bookValidation = [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title is required and must not exceed 200 characters'),
  body('author')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Author is required and must not exceed 100 characters'),
  body('genre')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Genre is required and must not exceed 50 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description must not exceed 1000 characters'),
  body('year')
    .optional()
    .isInt({ min: 1000, max: new Date().getFullYear() })
    .withMessage('Year must be between 1000 and current year')
];

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Book routes are working!' });
});

// Routes
router.get('/', getBooks);
router.get('/:id', getBook);
router.post('/', authMiddleware, bookValidation, createBook);
router.put('/:id', authMiddleware, bookValidation, updateBook);
router.delete('/:id', authMiddleware, deleteBook);

module.exports = router;


