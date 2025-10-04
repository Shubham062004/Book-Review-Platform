import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import api from '@/lib/axios';

const TestAPI = () => {
  const [apiStatus, setApiStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    testAPI();
  }, []);

  const testAPI = async () => {
    setApiStatus('loading');
    try {
      console.log('🧪 Testing API connection...');
      const response = await api.get('/api/health');
      setApiResponse(response.data);
      setApiStatus('success');
      console.log('✅ API connection successful:', response.data);
    } catch (error: any) {
      console.error('❌ API connection failed:', error);
      setError(error.message || 'Unknown error');
      setApiStatus('error');
    }
  };

  return (
    <Card className="max-w-md mx-auto m-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🧪 API Connection Test
        </CardTitle>
      </CardHeader>
      <CardContent>
        {apiStatus === 'loading' && (
          <div className="text-blue-600">Testing API connection...</div>
        )}
        
        {apiStatus === 'success' && (
          <div className="space-y-2">
            <div className="text-green-600 font-semibold">✅ API Connected!</div>
            <div className="text-xs bg-green-50 p-2 rounded">
              <pre>{JSON.stringify(apiResponse, null, 2)}</pre>
            </div>
          </div>
        )}
        
        {apiStatus === 'error' && (
          <div className="space-y-2">
            <div className="text-red-600 font-semibold">❌ API Connection Failed</div>
            <div className="text-xs bg-red-50 p-2 rounded text-red-800">
              {error}
            </div>
            <Button onClick={testAPI} size="sm" variant="outline">
              Retry
            </Button>
          </div>
        )}
        
        <div className="mt-4 text-xs text-gray-500">
          API URL: {import.meta.env.VITE_API_URL || 'Not configured'}
        </div>
      </CardContent>
    </Card>
  );
};

export default TestAPI;
