import { useState } from 'react';
import api from '@/lib/axios';

const TestConnection = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testHealth = async () => {
    setLoading(true);
    try {
      const response = await api.get('/api/health');
      setResult(`✅ Connected! ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setResult(`❌ Failed: ${error.message}`);
    }
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    try {
      const response = await api.post('/api/auth/login', {
        email: 'alice@example.com',
        password: 'alice123'
      });
      setResult(`✅ Login Success! ${JSON.stringify(response.data)}`);
    } catch (error: any) {
      setResult(`❌ Login Failed: ${error.response?.data?.message || error.message}`);
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Connection Test</h2>
      <button onClick={testHealth} disabled={loading}>
        Test Health Endpoint
      </button>
      <button onClick={testLogin} disabled={loading}>
        Test Login
      </button>
      <pre>{result}</pre>
    </div>
  );
};

export default TestConnection;
