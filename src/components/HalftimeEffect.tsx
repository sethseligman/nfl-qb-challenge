import React, { useEffect, useState } from 'react';

export const HalftimeEffect: React.FC<{ isVisible: boolean }> = ({ isVisible }) => {
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShowEffect(true);
      const timer = setTimeout(() => {
        setShowEffect(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  if (!showEffect) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 transition-opacity duration-500">
      <div className="relative">
        {/* Football field lines */}
        <div className="absolute inset-0 bg-[#2E7D32] opacity-80">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-white transform -translate-x-1/2"></div>
          <div className="absolute left-0 right-0 top-1/2 h-1 bg-white transform -translate-y-1/2"></div>
        </div>
        
        {/* Halftime text with animation */}
        <div className="relative px-12 py-8 text-center">
          <h2 className="text-4xl sm:text-6xl font-bold text-white mb-2 animate-bounce">
            HALFTIME
          </h2>
          <p className="text-lg sm:text-xl text-white/90 animate-pulse">
            10 more quarterbacks to go!
          </p>
        </div>

        {/* Decorative footballs */}
        <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 rotate-[-30deg]">
          <div className="football-pill"></div>
        </div>
        <div className="absolute -right-8 top-1/2 transform -translate-y-1/2 rotate-[30deg]">
          <div className="football-pill"></div>
        </div>
      </div>
    </div>
  );
}; 