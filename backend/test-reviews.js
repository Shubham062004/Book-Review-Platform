require('dotenv').config();
const mongoose = require('mongoose');
const Review = require('./models/Review');

async function testReviews() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const reviews = await Review.find().populate('userId', 'name');
    console.log('📝 All reviews in database:');
    
    reviews.forEach((review, index) => {
      console.log(`Review ${index + 1}:`, {
        id: review._id,
        rating: review.rating,
        reviewText: review.reviewText,
        textLength: review.reviewText?.length,
        user: review.userId?.name,
        createdAt: review.createdAt
      });
    });

    if (reviews.length === 0) {
      console.log('❌ No reviews found in database');
    }

    await mongoose.disconnect();
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testReviews();
