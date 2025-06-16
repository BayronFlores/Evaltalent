// src/components/common/LoadingSpinner.tsx
import React from 'react';
import { BarChart3 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  message = 'Cargando...',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        {/* Spinning ring */}
        <div
          className={`${sizeClasses[size]} border-4 border-gray-200 border-t-[#0284c7] rounded-full animate-spin`}
        ></div>

        {/* Logo in center */}
        <div className="absolute inset-0 flex items-center justify-center">
          <BarChart3 className={`${iconSizes[size]} text-[#0284c7]`} />
        </div>
      </div>

      {message && (
        <p className="text-sm text-gray-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
