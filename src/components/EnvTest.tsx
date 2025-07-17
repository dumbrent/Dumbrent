import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const EnvTest: React.FC = () => {
  const [testResults, setTestResults] = useState<Record<string, boolean>>({});

  const envVars = [
    { key: 'VITE_SUPABASE_URL', name: 'Supabase URL', required: true },
    { key: 'VITE_SUPABASE_ANON_KEY', name: 'Supabase Anon Key', required: true },
    { key: 'VITE_STRIPE_PUBLISHABLE_KEY', name: 'Stripe Publishable Key', required: true },
    { key: 'VITE_GOOGLE_MAPS_API_KEY', name: 'Google Maps API Key', required: true },
    { key: 'VITE_OPENAI_API_KEY', name: 'OpenAI API Key', required: false },
  ];

  const testEnvironment = () => {
    const results: Record<string, boolean> = {};
    
    envVars.forEach(({ key }) => {
      const value = import.meta.env[key];
      results[key] = !!(value && value.length > 0);
    });
    
    setTestResults(results);
  };

  const getIcon = (key: string, required: boolean) => {
    if (!(key in testResults)) return <AlertCircle className="h-5 w-5 text-gray-400" />;
    
    if (testResults[key]) {
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    } else if (required) {
      return <XCircle className="h-5 w-5 text-red-500" />;
    } else {
      return <AlertCircle className="h-5 w-5 text-yellow-500" />;
    }
  };

  const getStatus = (key: string, required: boolean) => {
    if (!(key in testResults)) return 'Not tested';
    
    if (testResults[key]) {
      return 'Configured';
    } else if (required) {
      return 'Missing (Required)';
    } else {
      return 'Missing (Optional)';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Environment Configuration Test</h2>
      
      <button
        onClick={testEnvironment}
        className="mb-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Test Environment Variables
      </button>

      <div className="space-y-3">
        {envVars.map(({ key, name, required }) => (
          <div key={key} className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center">
              {getIcon(key, required)}
              <div className="ml-3">
                <p className="font-medium text-gray-800">{name}</p>
                <p className="text-sm text-gray-500">{key}</p>
              </div>
            </div>
            <div className="text-right">
              <span className={`text-sm font-medium ${
                testResults[key] ? 'text-green-600' : 
                required ? 'text-red-600' : 'text-yellow-600'
              }`}>
                {getStatus(key, required)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(testResults).length > 0 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-semibold text-gray-800 mb-2">Test Summary:</h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-600">
                {Object.values(testResults).filter(Boolean).length}
              </div>
              <div className="text-sm text-gray-600">Configured</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-600">
                {envVars.filter(v => v.required && !testResults[v.key]).length}
              </div>
              <div className="text-sm text-gray-600">Missing Required</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-yellow-600">
                {envVars.filter(v => !v.required && !testResults[v.key]).length}
              </div>
              <div className="text-sm text-gray-600">Missing Optional</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvTest;