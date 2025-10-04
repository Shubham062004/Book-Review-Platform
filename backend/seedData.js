const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Book = require('./models/Book');
const Review = require('./models/Review');

// Sample data
const users = [
  {
    name: 'Alice Johnson',
    email: 'alice@example.com',
    password: 'alice123'
  },
  {
    name: 'Bob Smith',
    email: 'bob@example.com',
    password: 'bob123'
  },
  {
    name: 'Carol Davis',
    email: 'carol@example.com',
    password: 'carol123'
  },
  {
    name: 'David Wilson',
    email: 'david@example.com',
    password: 'david123'
  },
  {
    name: 'Emma Brown',
    email: 'emma@example.com',
    password: 'emma123'
  }
];

const books = [
  {
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    description: 'A classic American novel about the Jazz Age and the American Dream. Set in the summer of 1922, it tells the story of Jay Gatsby and his pursuit of Daisy Buchanan.',
    genre: 'Classic Literature',
    year: 1925
  },
  {
    title: '1984',
    author: 'George Orwell',
    description: 'A dystopian novel exploring themes of totalitarianism, surveillance, and individual freedom in a society controlled by Big Brother.',
    genre: 'Dystopian Fiction',
    year: 1949
  },
  {
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    description: 'A powerful story about racial injustice and moral growth in the American South during the 1930s, told through the eyes of Scout Finch.',
    genre: 'Classic Literature',
    year: 1960
  },
  {
    title: 'The Catcher in the Rye',
    author: 'J.D. Salinger',
    description: 'A coming-of-age story following Holden Caulfield as he navigates adolescence and criticizes the adult world around him.',
    genre: 'Coming-of-age',
    year: 1951
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    description: 'A romantic novel about Elizabeth Bennet and Mr. Darcy, exploring themes of love, class, and social expectations in Regency England.',
    genre: 'Romance',
    year: 1813
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    description: 'An adventure fantasy about Bilbo Baggins, a hobbit who embarks on an unexpected journey with dwarves to reclaim their homeland from a dragon.',
    genre: 'Fantasy',
    year: 1937
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'An epic science fiction saga set on the desert planet Arrakis, following Paul Atreides in his quest for survival and power.',
    genre: 'Science Fiction',
    year: 1965
  },
  {
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    description: 'A gripping thriller about journalist Mikael Blomkvist and hacker Lisbeth Salander investigating a decades-old disappearance.',
    genre: 'Mystery Thriller',
    year: 2005
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    description: 'A thought-provoking exploration of human history, from the Stone Age to the modern era, examining how Homo sapiens dominated the world.',
    genre: 'Non-fiction',
    year: 2011
  },
  {
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    description: 'A philosophical novel about Santiago, a young shepherd who travels from Spain to Egypt in search of treasure and discovers his personal legend.',
    genre: 'Philosophical Fiction',
    year: 1988
  }
];

const reviews = [
  // The Great Gatsby reviews
  {
    rating: 5,
    reviewText: 'Absolutely stunning prose and a masterful critique of the American Dream. Fitzgerald\'s writing is poetic and haunting.'
  },
  {
    rating: 4,
    reviewText: 'A beautiful yet tragic story that perfectly captures the excess and emptiness of the Jazz Age. Highly recommended.'
  },
  {
    rating: 3,
    reviewText: 'Good writing but found the characters somewhat unlikable. Still worth reading for its historical significance.'
  },
  
  // 1984 reviews
  {
    rating: 5,
    reviewText: 'Terrifyingly prophetic and more relevant today than ever. Orwell\'s vision of totalitarianism is chilling and thought-provoking.'
  },
  {
    rating: 5,
    reviewText: 'A masterpiece that everyone should read. The concepts of doublethink and newspeak are brilliantly executed.'
  },
  {
    rating: 4,
    reviewText: 'Dark and disturbing but incredibly important. Made me think about surveillance and freedom in new ways.'
  },
  
  // To Kill a Mockingbird reviews
  {
    rating: 5,
    reviewText: 'A powerful and moving story about justice, morality, and growing up. Scout is an unforgettable narrator.'
  },
  {
    rating: 4,
    reviewText: 'Beautifully written with important themes about racial injustice and moral courage. A true classic.'
  },
  
  // The Hobbit reviews
  {
    rating: 5,
    reviewText: 'A delightful adventure that started my love for fantasy. Bilbo\'s journey is both exciting and heartwarming.'
  },
  {
    rating: 4,
    reviewText: 'Wonderful world-building and charming characters. Perfect introduction to Middle-earth.'
  },
  
  // Dune reviews
  {
    rating: 5,
    reviewText: 'Epic in every sense of the word. Herbert created an incredibly detailed universe with complex politics and ecology.'
  },
  {
    rating: 4,
    reviewText: 'Challenging but rewarding read. The world-building is unparalleled in science fiction.'
  },
  
  // The Alchemist reviews
  {
    rating: 4,
    reviewText: 'Inspiring and philosophical. A simple story with profound messages about following your dreams.'
  },
  {
    rating: 3,
    reviewText: 'Nice message but felt a bit simplistic. Good for a quick, motivational read.'
  }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await User.deleteMany({});
    await Book.deleteMany({});
    await Review.deleteMany({});

    // Create users
    console.log('👥 Creating users...');
    const createdUsers = [];
    for (const userData of users) {
      // Don't hash manually - let the User model's pre('save') middleware handle it
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password  // Raw password - will be hashed by pre('save')
      });
      createdUsers.push(user);
      console.log(`   Created user: ${user.name}`);
    }

    // Create books
    console.log('📚 Creating books...');
    const createdBooks = [];
    for (let i = 0; i < books.length; i++) {
      const bookData = books[i];
      const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
      
      const book = await Book.create({
        ...bookData,
        addedBy: randomUser._id
      });
      createdBooks.push(book);
      console.log(`   Created book: ${book.title} by ${book.author}`);
    }

    // Create reviews
    console.log('⭐ Creating reviews...');
    let reviewIndex = 0;
    
    for (let i = 0; i < createdBooks.length && reviewIndex < reviews.length; i++) {
      const book = createdBooks[i];
      const reviewsPerBook = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per book
      
      for (let j = 0; j < reviewsPerBook && reviewIndex < reviews.length; j++) {
        const reviewData = reviews[reviewIndex];
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        
        // Check if user already reviewed this book
        const existingReview = await Review.findOne({
          bookId: book._id,
          userId: randomUser._id
        });
        
        if (!existingReview) {
          const review = await Review.create({
            bookId: book._id,
            userId: randomUser._id,
            rating: reviewData.rating,
            reviewText: reviewData.reviewText
          });
          console.log(`   Created review for "${book.title}" by ${randomUser.name} (${review.rating}⭐)`);
        }
        
        reviewIndex++;
      }
    }

    // Display summary
    const userCount = await User.countDocuments();
    const bookCount = await Book.countDocuments();
    const reviewCount = await Review.countDocuments();

    console.log('\n🎉 Database seeded successfully!');
    console.log('📊 Summary:');
    console.log(`   👥 Users created: ${userCount}`);
    console.log(`   📚 Books created: ${bookCount}`);
    console.log(`   ⭐ Reviews created: ${reviewCount}`);
    
    console.log('\n🔐 Test user credentials:');
    users.forEach(user => {
      console.log(`   Email: ${user.email} | Password: ${user.password}`);
    });

  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the seed function
seedDatabase();
