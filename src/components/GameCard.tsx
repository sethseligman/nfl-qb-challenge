import React from 'react';

interface GameCardProps {
  title: string;
  description: string;
  status: 'live' | 'coming-soon';
  isActive: boolean;
  onClick: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ 
  title, 
  description, 
  status, 
  isActive,
  onClick 
}) => {
  return (
    <div className="relative">
      <div 
        className={`relative rounded-xl overflow-hidden transition-all duration-300 ${
          isActive ? 'scale-105 shadow-lg' : 'hover:scale-105 hover:shadow-lg'
        }`}
      >
        <div className="relative bg-gray-800">
          <div className="w-full h-48 bg-gray-700 flex items-center justify-center">
            <img 
              src={`/images/${title.replace(/\s+/g, '-').toLowerCase()}.jpg`} 
              alt={title}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <div className="flex justify-between items-start mb-2">
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  status === 'live'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-600 text-gray-300'
                }`}
              >
                {status === 'live' ? 'Live' : 'Coming Soon'}
              </span>
            </div>
            <p className="text-gray-200 text-sm mb-4">{description}</p>
            {status === 'live' && (
              <button
                onClick={onClick}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
              >
                Play Now
              </button>
            )}
          </div>
          {status === 'live' && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Show rules modal
              }}
              className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-600 transition-colors"
            >
              Rules
            </button>
          )}
        </div>
      </div>
    </div>
  );
}; 