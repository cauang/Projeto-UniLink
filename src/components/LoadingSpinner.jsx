// src/components/LoadingSpinner.jsx
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = true }) => {
  const containerClasses = fullScreen 
    ? "min-h-screen w-full flex items-center justify-center bg-gray-50 fixed inset-0 z-50"
    : "w-full py-20 flex items-center justify-center";

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-3">
        <Loader2 size={50} className="animate-spin text-[#1E40FF]" />
        <p className="text-gray-500 text-sm font-medium animate-pulse">Carregando...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;