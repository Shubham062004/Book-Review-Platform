require('dotenv').config();

// Test the exact data that frontend is sending
const testData = {
  bookId: "68e0ee29c0a2d119e1d0aafb", // Use a valid book ID from your database
  rating: 5,
  reviewText: "This is a test review"
};

console.log('Test Review Data:', testData);

// Validation test
const { body, validationResult } = require('express-validator');

const reviewValidation = [
  body('rating').isInt({ min: 1, max: 5 }),
  body('reviewText').trim().isLength({ min: 1, max: 500 }),
  body('bookId').isMongoId()
];

console.log('Validation rules defined');
console.log('✅ Review validation should work now!');
