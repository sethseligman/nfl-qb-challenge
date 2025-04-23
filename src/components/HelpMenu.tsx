import React, { useState } from 'react';
import { HowToPlayModal, CleanPlayModal } from './GameModals';

interface HelpMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { top: number; right: number };
}

export const HelpMenu: React.FC<HelpMenuProps> = ({ isOpen, onClose, position }) => {
  const [activeModal, setActiveModal] = useState<'howToPlay' | 'cleanPlay' | null>(null);

  const menuItems = [
    { id: 'howToPlay', label: 'How to Play' },
    { id: 'cleanPlay', label: 'Game Philosophy & Help' },
  ] as const;

  // Close menu when clicking outside
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleMenuItemClick = (modalId: typeof menuItems[number]['id']) => {
    setActiveModal(modalId);
    onClose();
  };

  const handleModalClose = () => {
    setActiveModal(null);
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50"
          onClick={handleBackdropClick}
        >
          <div 
            className="absolute bg-white dark:bg-neutral-800 rounded-lg shadow-lg border border-neutral-200 dark:border-neutral-700 overflow-hidden"
            style={{ 
              top: `${position.top}px`, 
              right: `${position.right}px`,
              width: '240px',
              transform: 'translateY(8px)'
            }}
          >
            <div className="py-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleMenuItemClick(item.id)}
                  className="w-full px-4 py-3.5 text-left text-sm hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 flex items-center justify-between group transition-colors border-b border-neutral-200 dark:border-neutral-700 last:border-0"
                >
                  <span>{item.label}</span>
                  <span className="text-neutral-400 dark:text-neutral-500 group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                    →
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <HowToPlayModal
        isOpen={activeModal === 'howToPlay'}
        onClose={handleModalClose}
      />
      <CleanPlayModal
        isOpen={activeModal === 'cleanPlay'}
        onClose={handleModalClose}
      />
    </>
  );
}; 