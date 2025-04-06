import React, { useState } from 'react';
import { getQBPhoto } from '../utils/qbPhotos';

interface QBPhotoProps {
  qb: string;
  size?: 'sm' | 'lg';
}

export const QBPhoto: React.FC<QBPhotoProps> = ({ qb, size = 'sm' }) => {
  const [showImage, setShowImage] = useState(true);
  const photoUrl = getQBPhoto(qb);

  if (!showImage || !photoUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-700 rounded-full ${
        size === 'sm' ? 'w-6 h-6' : 'w-16 h-16'
      }`}>
        <span className={`text-gray-400 ${size === 'sm' ? 'text-xs' : 'text-lg'}`}>
          {qb.split(' ').map(n => n[0]).join('')}
        </span>
      </div>
    );
  }

  return (
    <img
      src={photoUrl}
      alt={qb}
      className={`object-contain rounded-full ${
        size === 'sm' ? 'w-6 h-6' : 'w-16 h-16'
      }`}
      onError={() => setShowImage(false)}
    />
  );
}; 