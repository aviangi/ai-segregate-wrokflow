
import React, { useState, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Loader } from './components/Loader';
import { ErrorAlert } from './components/ErrorAlert';
import { CameraView } from './components/CameraView';
import { analyzeWasteImage } from './services/geminiService';
import type { WasteAnalysisResponse } from './types';
import { RecycleIcon } from './components/icons';

const App: React.FC = () => {
  const [analysis, setAnalysis] = useState<WasteAnalysisResponse | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);

  const handleImageUpload = useCallback(async (file: File) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const base64String = (reader.result as string).split(',')[1];
        if (imageUrl) {
            URL.revokeObjectURL(imageUrl);
        }
        setImageUrl(URL.createObjectURL(file));

        const result = await analyzeWasteImage(base64String, file.type);
        setAnalysis(result);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
        setImageUrl(null);
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
        setError('Failed to read the image file.');
        setIsLoading(false);
    };
    reader.readAsDataURL(file);
  }, [imageUrl]);

  const handleReset = () => {
    setAnalysis(null);
    if(imageUrl) {
        URL.revokeObjectURL(imageUrl);
    }
    setImageUrl(null);
    setError(null);
    setIsLoading(false);
  };

  const handleCapture = useCallback((file: File) => {
    setIsCameraOpen(false);
    handleImageUpload(file);
  }, [handleImageUpload]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      {isCameraOpen && <CameraView onCapture={handleCapture} onClose={() => setIsCameraOpen(false)} />}
      <main className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <RecycleIcon className="h-12 w-12 text-green-400" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-500">
              Waste Segregation AI
            </h1>
          </div>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            Upload an image to identify, categorize, and learn how to properly dispose of waste items.
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          {error && <ErrorAlert message={error} />}

          {!imageUrl && !isLoading && (
            <ImageUploader 
              onImageUpload={handleImageUpload} 
              disabled={isLoading} 
              onOpenCamera={() => setIsCameraOpen(true)} 
            />
          )}

          {isLoading && <Loader />}

          {imageUrl && analysis && !isLoading && (
            <div className="mt-8">
              <ResultsDisplay imageUrl={imageUrl} analysis={analysis} />
              <div className="text-center mt-8">
                <button
                  onClick={handleReset}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50"
                >
                  Analyze Another Image
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Google Gemini. Built for a cleaner planet.</p>
      </footer>
    </div>
  );
};

export default App;
