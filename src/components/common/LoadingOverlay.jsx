import React from 'react';

const LoadingOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/50 flex items-center justify-center backdrop-blur-[1px] z-10">
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="h-2 w-2 bg-blue-600 rounded-full animate-bounce"></div>
      </div>
    </div>
  );
};

export default LoadingOverlay;