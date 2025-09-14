
import React from 'react';

export const Loader: React.FC = () => (
  <div className="flex flex-col items-center justify-center p-12 space-y-4">
    <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-indigo-400"></div>
    <p className="text-lg font-semibold text-indigo-300">Analyzing Image...</p>
    <p className="text-sm text-gray-400">AI is identifying and categorizing waste items.</p>
  </div>
);
