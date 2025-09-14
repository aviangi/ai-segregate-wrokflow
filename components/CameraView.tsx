
import React, { useRef, useEffect, useState, useCallback } from 'react';
import { CameraIcon, AlertTriangleIcon } from './icons';

interface CameraViewProps {
  onCapture: (file: File) => void;
  onClose: () => void;
}

export const CameraView: React.FC<CameraViewProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mediaStream: MediaStream;
    const getCameraStream = async () => {
      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: 'environment', // Prefer back camera
          },
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setStream(mediaStream);
      } catch (err) {
        console.error("Error accessing camera:", err);
        // Fallback to any camera if environment fails
        try {
            const constraints: MediaStreamConstraints = { video: true };
            mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
            setStream(mediaStream);
        } catch (fallbackErr) {
            console.error("Fallback camera access failed:", fallbackErr);
            setError("Could not access the camera. Please ensure permissions are granted and try again.");
        }
      }
    };

    getCameraStream();

    return () => {
      // Use the state variable for cleanup
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only on mount

  const handleCapture = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], `capture-${Date.now()}.jpg`, { type: 'image/jpeg' });
        onCapture(file);
      }
    }, 'image/jpeg', 0.95);
  }, [onCapture]);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center p-4 animate-fade-in" aria-modal="true" role="dialog">
      <div className="relative w-full max-w-4xl aspect-video bg-gray-900 rounded-lg overflow-hidden shadow-2xl shadow-cyan-500/20">
        <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline muted />
        {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900/80 p-4">
                <AlertTriangleIcon className="w-12 h-12 text-red-400 mb-4" />
                <p className="text-red-300 text-center font-semibold">{error}</p>
            </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      <div className="mt-8 flex items-center justify-center w-full max-w-4xl gap-8">
        <button
          onClick={onClose}
          className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-gray-500 focus:ring-opacity-50"
          aria-label="Close camera view"
        >
          Cancel
        </button>
        <button
          onClick={handleCapture}
          disabled={!!error || !stream}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold p-4 rounded-full transition-transform transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-green-500 focus:ring-opacity-50"
          aria-label="Capture image"
        >
          <CameraIcon className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};
