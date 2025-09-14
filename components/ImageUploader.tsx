
import React, { useState, useCallback, useRef } from 'react';
import { UploadCloudIcon, CameraIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  disabled: boolean;
  onOpenCamera: () => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, disabled, onOpenCamera }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload]);

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  const handleCameraButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!disabled) {
      onOpenCamera();
    }
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors duration-300 ease-in-out ${
        isDragging ? 'border-indigo-500 bg-gray-800' : 'border-gray-600 bg-gray-800/50'
      } ${disabled ? 'opacity-50' : 'hover:border-indigo-400'}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div 
        onClick={handleClick}
        className={`${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
          accept="image/*"
          disabled={disabled}
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <UploadCloudIcon className="w-16 h-16 text-gray-500" />
          <p className="text-xl font-semibold text-gray-300">
            <span className="text-indigo-400">Click to upload</span> or drag and drop
          </p>
          <p className="text-gray-500">Supports PNG, JPG, WEBP, etc.</p>
        </div>
      </div>
      
      <div className="relative flex py-5 items-center">
        <div className="flex-grow border-t border-gray-600"></div>
        <span className="flex-shrink mx-4 text-gray-500 text-sm font-semibold">OR</span>
        <div className="flex-grow border-t border-gray-600"></div>
      </div>
      
      <button
        onClick={handleCameraButtonClick}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50 disabled:bg-gray-600 disabled:hover:bg-gray-600 disabled:scale-100 disabled:cursor-not-allowed"
        aria-label="Use camera to take a photo"
      >
        <CameraIcon className="w-6 h-6" />
        Use Camera
      </button>
    </div>
  );
};
