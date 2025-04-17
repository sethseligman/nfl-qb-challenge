import React, { useEffect, useState } from 'react';

interface SpecialEffectsProps {
  isVisible: boolean;
}

export const SpecialEffects: React.FC<SpecialEffectsProps> = ({ isVisible }) => {
  const [showText1, setShowText1] = useState(false);
  const [showText2, setShowText2] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // First text appears immediately with the flame
      setShowText1(true);
      
      // Second text appears after 0.8s
      const timer1 = setTimeout(() => {
        setShowText1(false);
        setShowText2(true);
      }, 800);
      
      // Everything disappears after 2s
      const timer2 = setTimeout(() => {
        setShowText2(false);
      }, 2000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
      };
    } else {
      setShowText1(false);
      setShowText2(false);
    }
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
      <div className={`absolute inset-0 bg-black/30 ${isVisible ? 'animate-fade-in' : ''}`} />
      
      {/* Flame Effect */}
      <div className={`absolute inset-0 ${isVisible ? 'animate-flame' : ''}`}>
        <div className="flame-wrapper">
          <div className="flame red"></div>
          <div className="flame orange"></div>
          <div className="flame gold"></div>
        </div>
      </div>

      {/* Text Overlays */}
      <div className="relative text-center">
        <div className={`transition-opacity duration-500 text-4xl font-bold text-yellow-400 
          ${showText1 ? 'opacity-100' : 'opacity-0'}`}>
          YOU GOT THE GOAT
        </div>
        <div className={`transition-opacity duration-500 text-4xl font-bold text-red-500 
          ${showText2 ? 'opacity-100' : 'opacity-0'}`}>
          LET'S F#%KING GO
        </div>
      </div>
    </div>
  );
}; 