const { validationResult } = require('express-validator');
const Book = require('../models/Book');
const Review = require('../models/Review');

// @desc    Get all books with pagination
// @route   GET /api/books?page=1&limit=5&search=keyword&genre=fiction
// @access  Public
const getBooks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;
    const search = req.query.search || '';
    const genre = req.query.genre || '';

    // Build query
    let query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } }
      ];
    }
    if (genre) {
      query.genre = { $regex: genre, $options: 'i' };
    }

    const books = await Book.find(query)
      .populate('addedBy', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Calculate average rating for each book
    const booksWithRatings = await Promise.all(
      books.map(async (book) => {
        const avgRating = await book.calculateAverageRating();
        return {
          ...book.toJSON(),
          averageRating: avgRating
        };
      })
    );

    const total = await Book.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({
      books: booksWithRatings,
      pagination: {
        currentPage: page,
        totalPages,
        totalBooks: total,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Server error fetching books' });
  }
};

// @desc    Get single book
// @route   GET /api/books/:id
// @access  Public
const getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id).populate('addedBy', 'name');
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Calculate average rating
    const averageRating = await book.calculateAverageRating();

    res.json({
      ...book.toJSON(),
      averageRating
    });

  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Server error fetching book' });
  }
};

// @desc    Create new book
// @route   POST /api/books
// @access  Private
const createBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { title, author, description, genre, year } = req.body;

    const book = await Book.create({
      title,
      author,
      description,
      genre,
      year,
      addedBy: req.user._id
    });

    const populatedBook = await Book.findById(book._id).populate('addedBy', 'name');

    res.status(201).json({
      message: 'Book created successfully',
      book: populatedBook
    });

  } catch (error) {
    console.error('Create book error:', error);
    res.status(500).json({ message: 'Server error creating book' });
  }
};

// @desc    Update book
// @route   PUT /api/books/:id
// @access  Private (only book creator)
const updateBook = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the book creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this book' });
    }

    const { title, author, description, genre, year } = req.body;

    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      { title, author, description, genre, year },
      { new: true, runValidators: true }
    ).populate('addedBy', 'name');

    res.json({
      message: 'Book updated successfully',
      book: updatedBook
    });

  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Server error updating book' });
  }
};

// @desc    Delete book
// @route   DELETE /api/books/:id
// @access  Private (only book creator)
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if user is the book creator
    if (book.addedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this book' });
    }

    // Delete all reviews for this book
    await Review.deleteMany({ bookId: req.params.id });

    // Delete the book
    await Book.findByIdAndDelete(req.params.id);

    res.json({ message: 'Book and associated reviews deleted successfully' });

  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Server error deleting book' });
  }
};

module.exports = {
  getBooks,
  getBook,
  createBook,
  updateBook,
  deleteBook
};


