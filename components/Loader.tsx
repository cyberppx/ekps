
import React from 'react';

interface LoaderProps {
  message: string;
}

const Loader: React.FC<LoaderProps> = ({ message }) => {
  return (
    <div className="fixed inset-0 bg-black/70 flex flex-col items-center justify-center z-50 backdrop-blur-sm">
      <div className="w-16 h-16 border-4 border-t-purple-500 border-gray-200 dark:border-gray-600 rounded-full animate-spin"></div>
      <p className="mt-4 text-lg text-white">{message}</p>
    </div>
  );
};

export default Loader;
