
import React, { useState, useRef, useCallback, useEffect } from 'react';
import { tr } from '../constants/translations';
import { ChevronLeftRightIcon } from './Icons';

interface ImageComparatorProps {
  originalImage: string;
  editedImage: string;
}

const ImageComparator: React.FC<ImageComparatorProps> = ({ originalImage, editedImage }) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback((clientX: number) => {
    if (!isDragging || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percent = (x / rect.width) * 100;
    setSliderPosition(percent);
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
  };

  const handleMouseUp = useCallback(() => setIsDragging(false), []);
  const handleTouchEnd = useCallback(() => setIsDragging(false), []);

  const handleMouseMove = useCallback((e: MouseEvent) => handleMove(e.clientX), [handleMove]);
  const handleTouchMove = useCallback((e: TouchEvent) => handleMove(e.touches[0].clientX), [handleMove]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, handleMouseMove, handleTouchMove, handleMouseUp, handleTouchEnd]);

  return (
    <div 
      ref={imageContainerRef} 
      className="relative w-full max-w-5xl mx-auto aspect-auto overflow-hidden select-none rounded-lg shadow-2xl touch-none"
      onMouseUp={handleMouseUp}
      onTouchEnd={handleTouchEnd}
    >
      <img src={`data:image/jpeg;base64,${originalImage}`} alt={tr.before} draggable="false" className="block w-full h-auto object-contain pointer-events-none" />
      <div 
        className="absolute top-0 left-0 h-full w-full overflow-hidden pointer-events-none" 
        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
      >
        <img src={`data:image/jpeg;base64,${editedImage}`} alt={tr.after} draggable="false" className="block w-full h-auto object-contain pointer-events-none" />
      </div>
      <div 
        className="absolute top-0 bottom-0 w-1 bg-white/50 backdrop-blur-sm cursor-ew-resize" 
        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }} 
        onMouseDown={handleMouseDown} 
        onTouchStart={handleTouchStart}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -left-4 w-9 h-9 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-lg flex items-center justify-center backdrop-blur-sm border border-white/20 dark:border-gray-700/50">
           <ChevronLeftRightIcon />
        </div>
      </div>
    </div>
  );
};

export default ImageComparator;
