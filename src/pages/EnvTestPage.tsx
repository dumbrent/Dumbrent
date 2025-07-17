import React from 'react';
import Layout from '../components/layout/Layout';
import EnvTest from '../components/EnvTest';

const EnvTestPage: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Environment Configuration Test</h1>
          <p className="text-gray-600">
            Test your API keys and environment variables to ensure everything is properly configured.
          </p>
        </div>
        <EnvTest />
      </div>
    </Layout>
  );
};

export default EnvTestPage;