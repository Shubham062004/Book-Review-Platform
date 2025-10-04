const Wishlist = require('../models/Wishlist');
const Book = require('../models/Book');

// @desc    Get user's wishlist
// @route   GET /api/wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    console.log('📋 Getting wishlist for user:', req.user._id);
    
    const wishlistItems = await Wishlist.find({ userId: req.user._id })
      .populate({
        path: 'bookId',
        populate: {
          path: 'addedBy',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });

    // Calculate average rating for each book
    const wishlistWithRatings = await Promise.all(
      wishlistItems.map(async (item) => {
        if (item.bookId) {
          const avgRating = await item.bookId.calculateAverageRating();
          return {
            _id: item._id,
            book: {
              ...item.bookId.toJSON(),
              averageRating: avgRating
            },
            addedAt: item.createdAt
          };
        }
        return null;
      })
    );

    const validWishlist = wishlistWithRatings.filter(item => item !== null);

    console.log(`📋 Found ${validWishlist.length} wishlist items`);
    res.json(validWishlist);

  } catch (error) {
    console.error('❌ Get wishlist error:', error);
    res.status(500).json({ message: 'Server error fetching wishlist' });
  }
};

// @desc    Add book to wishlist
// @route   POST /api/wishlist/:bookId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    console.log('📋 Adding to wishlist:', { userId: req.user._id, bookId });

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Check if already in wishlist
    const existingWishlistItem = await Wishlist.findOne({
      userId: req.user._id,
      bookId
    });

    if (existingWishlistItem) {
      return res.status(400).json({ message: 'Book already in wishlist' });
    }

    const wishlistItem = await Wishlist.create({
      userId: req.user._id,
      bookId
    });

    const populatedItem = await Wishlist.findById(wishlistItem._id)
      .populate({
        path: 'bookId',
        populate: {
          path: 'addedBy',
          select: 'name'
        }
      });

    console.log('✅ Added to wishlist successfully');
    res.status(201).json({
      message: 'Book added to wishlist',
      wishlistItem: populatedItem
    });

  } catch (error) {
    console.error('❌ Add to wishlist error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Book already in wishlist' });
    }
    res.status(500).json({ message: 'Server error adding to wishlist' });
  }
};

// @desc    Remove book from wishlist
// @route   DELETE /api/wishlist/:bookId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { bookId } = req.params;
    console.log('📋 Removing from wishlist:', { userId: req.user._id, bookId });

    const wishlistItem = await Wishlist.findOneAndDelete({
      userId: req.user._id,
      bookId
    });

    if (!wishlistItem) {
      return res.status(404).json({ message: 'Book not found in wishlist' });
    }

    console.log('✅ Removed from wishlist successfully');
    res.json({ message: 'Book removed from wishlist' });

  } catch (error) {
    console.error('❌ Remove from wishlist error:', error);
    res.status(500).json({ message: 'Server error removing from wishlist' });
  }
};

// @desc    Check if book is in wishlist
// @route   GET /api/wishlist/check/:bookId
// @access  Private
const checkWishlistStatus = async (req, res) => {
  try {
    const { bookId } = req.params;
    
    const wishlistItem = await Wishlist.findOne({
      userId: req.user._id,
      bookId
    });

    res.json({ inWishlist: !!wishlistItem });

  } catch (error) {
    console.error('❌ Check wishlist error:', error);
    res.status(500).json({ message: 'Server error checking wishlist' });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  checkWishlistStatus
};
