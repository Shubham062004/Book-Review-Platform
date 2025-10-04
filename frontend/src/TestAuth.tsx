import { useState } from 'react';
import api from '@/lib/axios';

const TestAuth = () => {
  const [result, setResult] = useState('');

  const testLogin = async () => {
    try {
      const response = await api.post('/api/auth/login', {
        email: 'alice@example.com',
        password: 'alice123'
      });
      setResult(`✅ SUCCESS: ${JSON.stringify(response.data, null, 2)}`);
    } catch (error: any) {
      setResult(`❌ ERROR: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧪 Auth Test</h2>
      <button onClick={testLogin} style={{ padding: '10px', margin: '10px' }}>
        Test Login (alice@example.com / alice123)
      </button>
      <pre style={{ background: '#f5f5f5', padding: '10px' }}>{result}</pre>
    </div>
  );
};

export default TestAuth;
