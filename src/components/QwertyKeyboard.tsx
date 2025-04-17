import React, { useEffect, useRef } from 'react';

const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

interface QwertyKeyboardProps {
  onKeyPress: (key: string) => void;
  onBackspace: () => void;
  onEnter: () => void;
  isDisabled?: boolean;
  onHeightChange?: (height: number) => void;
}

export const QwertyKeyboard: React.FC<QwertyKeyboardProps> = ({
  onKeyPress,
  onBackspace,
  onEnter,
  isDisabled,
  onHeightChange
}) => {
  const keyboardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (keyboardRef.current && onHeightChange) {
      const observer = new ResizeObserver((entries) => {
        const height = entries[0].contentRect.height;
        onHeightChange(height);
      });
      
      observer.observe(keyboardRef.current);
      return () => observer.disconnect();
    }
  }, [onHeightChange]);

  return (
    <div 
      ref={keyboardRef}
      className="fixed bottom-0 left-0 right-0 w-full bg-white dark:bg-black border-t border-slate-200 dark:border-neutral-800 shadow-lg"
    >
      <div className="w-full max-w-[600px] mx-auto px-2 sm:px-4 py-2 sm:py-3">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div 
            key={rowIndex} 
            className={`flex justify-center gap-1 sm:gap-1.5 mb-1.5 sm:mb-2 ${
              rowIndex === 1 ? 'px-[5%]' : rowIndex === 2 ? 'px-[2%]' : ''
            }`}
          >
            {rowIndex === 2 && (
              <button
                onClick={onEnter}
                disabled={isDisabled}
                className="keyboard-key flex-[1.5] bg-slate-300 dark:bg-neutral-600 font-medium text-sm sm:text-base"
              >
                Submit
              </button>
            )}
            {row.map((key) => (
              <button
                key={key}
                onClick={() => onKeyPress(key)}
                disabled={isDisabled}
                className="keyboard-key flex-1 bg-slate-200 dark:bg-neutral-700"
              >
                {key}
              </button>
            ))}
            {rowIndex === 2 && (
              <button
                onClick={onBackspace}
                disabled={isDisabled}
                className="keyboard-key flex-[1.5] bg-slate-300 dark:bg-neutral-600 font-medium text-sm sm:text-base"
              >
                Clear
              </button>
            )}
          </div>
        ))}
        
        {/* Space Bar */}
        <div className="flex justify-center mt-1.5 sm:mt-2">
          <button
            onClick={() => onKeyPress(' ')}
            disabled={isDisabled}
            className="keyboard-key-space bg-slate-200 dark:bg-neutral-700 w-[60%] h-8 sm:h-10 rounded-md font-medium text-sm"
          >
            space
          </button>
        </div>

        <style>{`
          .keyboard-key {
            height: 3rem;
            min-width: 1.5rem;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 0.375rem;
            font-weight: 500;
            transition: all 0.1s;
            color: var(--color-main);
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
          }

          @media (min-width: 640px) {
            .keyboard-key {
              height: 3.5rem;
              min-width: 2rem;
            }
          }

          .keyboard-key-space {
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.1s;
            color: var(--color-main);
            user-select: none;
            -webkit-user-select: none;
            touch-action: manipulation;
          }

          .keyboard-key:disabled,
          .keyboard-key-space:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }

          .keyboard-key:not(:disabled):active,
          .keyboard-key-space:not(:disabled):active {
            transform: scale(0.95);
            background-color: var(--color-neutral-300);
          }

          @media (max-width: 360px) {
            .keyboard-key,
            .keyboard-key-space {
              font-size: 0.875rem;
            }
          }
        `}</style>
      </div>
    </div>
  );
}; 