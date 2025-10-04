const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const mongoose = require('mongoose');

console.log('🔍 Testing MongoDB connection...');
console.log('Current directory:', __dirname);
console.log('MONGODB_URI:', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully!');
    console.log('🎉 Database connection test passed!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection failed:', error);
    console.error('💡 Check your MongoDB Atlas settings:');
    console.error('   1. Network Access: Add 0.0.0.0/0 or your IP');
    console.error('   2. Database User: Verify username and password');
    console.error('   3. Connection String: Check the URI format');
    process.exit(1);
  });
