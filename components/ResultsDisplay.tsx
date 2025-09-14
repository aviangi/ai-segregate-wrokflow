
import React, { useState } from 'react';
import type { WasteAnalysisResponse, WasteObject } from '../types';
import { BoundingBox } from './BoundingBox';

interface ResultsDisplayProps {
  imageUrl: string;
  analysis: WasteAnalysisResponse;
}

const CATEGORY_COLORS: Record<string, string> = {
  "Organic": "bg-green-600/20 text-green-300 border border-green-500",
  "Recyclable": "bg-blue-600/20 text-blue-300 border border-blue-500",
  "Hazardous": "bg-red-600/20 text-red-300 border border-red-500",
  "Electronic Waste": "bg-yellow-600/20 text-yellow-300 border border-yellow-500",
  "Plastic": "bg-pink-600/20 text-pink-300 border border-pink-500",
  "Dry Waste": "bg-amber-600/20 text-amber-300 border border-amber-500",
  "Wet Waste": "bg-teal-600/20 text-teal-300 border border-teal-500",
  "default": "bg-gray-600/20 text-gray-300 border border-gray-500",
};

const getCategoryColor = (category: string): string => {
  return CATEGORY_COLORS[category] || CATEGORY_COLORS.default;
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ imageUrl, analysis }) => {
  const [hoveredObjectId, setHoveredObjectId] = useState<number | null>(null);

  const confidenceColor = (confidence: number) => {
    if (confidence > 0.85) return 'text-green-400';
    if (confidence > 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3 relative shadow-2xl rounded-lg overflow-hidden">
          <img src={imageUrl} alt="Waste analysis" className="w-full h-auto object-contain" />
          {analysis.objects.map((obj) => (
            obj.bbox && (
              <BoundingBox
                key={obj.id}
                box={obj.bbox}
                label={obj.name}
                isHovered={hoveredObjectId === obj.id}
              />
            )
          ))}
        </div>
        <div className="lg:col-span-2 bg-gray-800/50 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-300 to-cyan-400">Analysis Summary</h2>
          <div className="space-y-3">
            <div>
              <span className="font-semibold text-gray-400">Overall Confidence:</span>
              <span className={`ml-2 font-bold ${confidenceColor(analysis.summary.image_confidence)}`}>
                {(analysis.summary.image_confidence * 100).toFixed(1)}%
              </span>
            </div>
            <div>
              <span className="font-semibold text-gray-400">Detected Items:</span>
              <span className="ml-2 font-bold text-white">{analysis.objects.length}</span>
            </div>
            <div className="pt-2">
              <h3 className="font-semibold text-gray-400 mb-2">Category Counts:</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(analysis.summary.counts).map(([category, count]) => (
                  <span key={category} className={`px-2.5 py-1 text-sm font-medium rounded-full ${getCategoryColor(category)}`}>
                    {category}: {count}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold text-center mb-6">Detected Objects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {analysis.objects.map((obj) => (
            <div
              key={obj.id}
              onMouseEnter={() => setHoveredObjectId(obj.id)}
              onMouseLeave={() => setHoveredObjectId(null)}
              className="bg-gray-800 border border-gray-700 rounded-lg p-5 transition-all duration-300 hover:shadow-cyan-500/20 hover:shadow-lg hover:border-cyan-500 transform hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-3">
                 <h3 className="text-xl font-bold capitalize text-white">{obj.name}</h3>
                 <span className={`font-mono text-sm font-semibold ${confidenceColor(obj.confidence)}`}>
                   {(obj.confidence * 100).toFixed(0)}%
                 </span>
              </div>

              {obj.uncertain && (
                <div className="mb-3 text-sm text-yellow-400 bg-yellow-900/50 border border-yellow-700 rounded px-2 py-1">
                  Model is uncertain about this item.
                </div>
              )}

              <div className="mb-4">
                <p className="font-semibold text-gray-400 text-sm mb-2">Categories:</p>
                <div className="flex flex-wrap gap-2">
                  {obj.categories.map((cat) => (
                    <span key={cat} className={`px-2 py-0.5 text-xs font-semibold rounded-md ${getCategoryColor(cat)}`}>
                      {cat}
                    </span>
                  ))}
                </div>
              </div>
              
              <div>
                 <p className="font-semibold text-gray-400 text-sm mb-1">Disposal Recommendation:</p>
                 <p className="text-cyan-300">{obj.recommended_disposal}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
