require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./models/Review');
const Book = require('./models/Book');
const User = require('./models/User');

async function addTestReview() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get first book and user
    const book = await Book.findOne();
    const user = await User.findOne();
    
    if (!book || !user) {
      console.log('❌ No books or users found');
      return;
    }

    console.log('📚 Using book:', book.title);
    console.log('👤 Using user:', user.name);

    const testReview = await Review.create({
      bookId: book._id,
      userId: user._id,
      rating: 5,
      reviewText: "This is a test review with visible text! Great book!"
    });
    
    console.log('✅ Test review created:', {
      id: testReview._id,
      rating: testReview.rating,
      reviewText: testReview.reviewText,
      book: book.title,
      user: user.name
    });

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

addTestReview();
