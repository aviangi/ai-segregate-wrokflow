
import React from 'react';
import { AlertTriangleIcon } from './icons';

interface ErrorAlertProps {
  message: string;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message }) => (
  <div className="bg-red-900/50 border-l-4 border-red-500 text-red-300 p-4 rounded-r-lg mb-6" role="alert">
    <div className="flex items-center">
      <AlertTriangleIcon className="h-6 w-6 mr-3 text-red-400" />
      <div>
        <p className="font-bold">An Error Occurred</p>
        <p className="text-sm">{message}</p>
      </div>
    </div>
  </div>
);
