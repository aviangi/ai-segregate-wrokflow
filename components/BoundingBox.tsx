
import React from 'react';

interface BoundingBoxProps {
  box: [number, number, number, number];
  label: string;
  isHovered: boolean;
}

export const BoundingBox: React.FC<BoundingBoxProps> = ({ box, label, isHovered }) => {
  const [x, y, width, height] = box;

  const style: React.CSSProperties = {
    left: `${x * 100}%`,
    top: `${y * 100}%`,
    width: `${width * 100}%`,
    height: `${height * 100}%`,
  };

  return (
    <div
      style={style}
      className={`absolute transition-all duration-300 ease-in-out
        ${isHovered 
          ? 'border-4 border-cyan-400 bg-cyan-400/30 shadow-2xl shadow-cyan-500/50' 
          : 'border-2 border-green-400 bg-green-400/20'
        }`}
    >
      <span
        className={`absolute -top-6 left-0 px-2 py-0.5 text-xs font-semibold rounded
          ${isHovered ? 'bg-cyan-400 text-black' : 'bg-green-400 text-black'}`}
      >
        {label}
      </span>
    </div>
  );
};
