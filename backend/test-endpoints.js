const http = require('http');

const testEndpoint = (path, expectedMessage) => {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 5000,
      path: path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log(`✅ ${path} - Status: ${res.statusCode}`);
          console.log(`   Response: ${response.message || 'OK'}`);
          resolve(true);
        } catch (error) {
          console.log(`❌ ${path} - Failed to parse JSON`);
          resolve(false);
        }
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${path} - Connection failed: ${error.message}`);
      resolve(false);
    });

    req.setTimeout(5000, () => {
      console.log(`❌ ${path} - Timeout`);
      req.destroy();
      resolve(false);
    });

    req.end();
  });
};

const runTests = async () => {
  console.log('🧪 Testing Book Review API Endpoints...\n');

  const endpoints = [
    '/',
    '/api/health',
    '/api/auth/test',
    '/api/books/test',
    '/api/books',
    '/api/reviews/test'
  ];

  let passed = 0;
  let total = endpoints.length;

  for (const endpoint of endpoints) {
    const success = await testEndpoint(endpoint);
    if (success) passed++;
    console.log(''); // Empty line for readability
  }

  console.log(`📊 Test Results: ${passed}/${total} endpoints working`);
  
  if (passed === total) {
    console.log('🎉 All endpoints are working correctly!');
  } else {
    console.log('⚠️  Some endpoints are not working. Check your server logs.');
  }
};

runTests();
