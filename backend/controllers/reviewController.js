const { validationResult } = require('express-validator');
const Review = require('../models/Review');
const Book = require('../models/Book');

// @desc    Get reviews for a book
// @route   GET /api/reviews/:bookId
// @access  Public
const getBookReviews = async (req, res) => {
  try {
    console.log('📝 Getting reviews for book:', req.params.bookId);
    
    const reviews = await Review.find({ bookId: req.params.bookId })
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    console.log(`📝 Found ${reviews.length} reviews`);
    res.json(reviews);

  } catch (error) {
    console.error('❌ Get reviews error:', error);
    res.status(500).json({ message: 'Server error fetching reviews' });
  }
};

// @desc    Add review
// @route   POST /api/reviews
// @access  Private
const addReview = async (req, res) => {
  try {
    console.log('📝 Adding review with data:', req.body);
    console.log('📝 User:', req.user);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { bookId, rating, reviewText } = req.body;

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user already reviewed this book
    const existingReview = await Review.findOne({
      bookId,
      userId: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this book' });
    }

    const review = await Review.create({
      bookId,
      userId: req.user._id,
      rating,
      reviewText
    });

    const populatedReview = await Review.findById(review._id).populate('userId', 'name');

    console.log('✅ Review created successfully:', populatedReview);

    res.status(201).json({
      message: 'Review added successfully',
      review: populatedReview
    });

  } catch (error) {
    console.error('❌ Add review error:', error);
    res.status(500).json({ message: 'Server error adding review' });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (only review author)
const updateReview = async (req, res) => {
  try {
    console.log('📝 Updating review:', req.params.id, req.body);

    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the review author
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    const { rating, reviewText } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      req.params.id,
      { rating, reviewText },
      { new: true, runValidators: true }
    ).populate('userId', 'name');

    console.log('✅ Review updated successfully:', updatedReview);

    res.json({
      message: 'Review updated successfully',
      review: updatedReview
    });

  } catch (error) {
    console.error('❌ Update review error:', error);
    res.status(500).json({ message: 'Server error updating review' });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (only review author)
const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user is the review author
    if (review.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    await Review.findByIdAndDelete(req.params.id);

    res.json({ message: 'Review deleted successfully' });

  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Server error deleting review' });
  }
};

module.exports = {
  getBookReviews,
  addReview,
  updateReview,
  deleteReview
};


