const http = require('http');

const testBooksAPI = () => {
  return new Promise((resolve) => {
    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/books',
      method: 'GET'
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('📚 Books API Response:');
          console.log(`   Total books: ${response.pagination.totalBooks}`);
          console.log(`   Books returned: ${response.books.length}`);
          console.log('   Sample books:');
          response.books.slice(0, 3).forEach(book => {
            console.log(`     • ${book.title} by ${book.author} (${book.genre})`);
          });
          resolve(true);
        } catch (error) {
          console.log('❌ Error parsing response:', error.message);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Request failed:', error.message);
      resolve(false);
    });

    req.end();
  });
};

const testLogin = () => {
  return new Promise((resolve) => {
    const loginData = JSON.stringify({
      email: 'alice@example.com',
      password: 'alice123'
    });

    const req = http.request({
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': loginData.length
      }
    }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('🔐 Login Test:');
          console.log(`   Status: ${response.message}`);
          console.log(`   User: ${response.user.name} (${response.user.email})`);
          console.log(`   Token: ${response.token.substring(0, 20)}...`);
          resolve(true);
        } catch (error) {
          console.log('❌ Login failed:', error.message);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Login request failed:', error.message);
      resolve(false);
    });

    req.write(loginData);
    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Testing Seeded Data...\n');
  
  const booksTest = await testBooksAPI();
  console.log('');
  
  const loginTest = await testLogin();
  console.log('');
  
  if (booksTest && loginTest) {
    console.log('🎉 All tests passed! Your database is properly seeded.');
  } else {
    console.log('⚠️  Some tests failed. Check your server logs.');
  }
};

runTests();
