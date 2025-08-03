import React from 'react';

const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[rgb(134,74,239)]"></div>
  </div>
);

export default LoadingSpinner;