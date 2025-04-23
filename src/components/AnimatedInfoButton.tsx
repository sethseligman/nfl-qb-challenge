import { useEffect, useRef, useState, forwardRef } from 'react';

interface AnimatedInfoButtonProps {
  onClick: () => void;
  className?: string;
}

export const AnimatedInfoButton = forwardRef<HTMLButtonElement, AnimatedInfoButtonProps>(
  ({ onClick, className = '' }, ref) => {
    const [hasBeenClicked, setHasBeenClicked] = useState(() => {
      return sessionStorage.getItem('infoButtonClicked') === 'true';
    });
    const [shouldAnimate, setShouldAnimate] = useState(false);
    const inactivityTimer = useRef<NodeJS.Timeout>();
    const lastActivityTime = useRef<number>(Date.now());

    useEffect(() => {
      // Don't start the timer if already clicked
      if (hasBeenClicked) {
        return;
      }

      const handleActivity = () => {
        lastActivityTime.current = Date.now();
        // Reset animation state when there's activity
        setShouldAnimate(false);
      };

      // Track user activity
      window.addEventListener('keydown', handleActivity);
      window.addEventListener('mousedown', handleActivity);
      window.addEventListener('touchstart', handleActivity);

      // Check for inactivity every second
      const checkInactivity = setInterval(() => {
        const inactiveTime = Date.now() - lastActivityTime.current;
        if (inactiveTime >= 15000) { // 15 seconds
          setShouldAnimate(true);
          // Clear the interval since we only want to show the animation once
          clearInterval(inactivityTimer.current);
        }
      }, 1000);

      inactivityTimer.current = checkInactivity;

      return () => {
        window.removeEventListener('keydown', handleActivity);
        window.removeEventListener('mousedown', handleActivity);
        window.removeEventListener('touchstart', handleActivity);
        if (inactivityTimer.current) {
          clearInterval(inactivityTimer.current);
        }
      };
    }, [hasBeenClicked]);

    const handleClick = () => {
      if (!hasBeenClicked) {
        setHasBeenClicked(true);
        sessionStorage.setItem('infoButtonClicked', 'true');
      }
      setShouldAnimate(false);
      onClick();
    };

    return (
      <button
        ref={ref}
        onClick={handleClick}
        className={`${className} ${shouldAnimate ? 'animate-info-pulse' : ''}`}
        aria-label="Game Info"
      >
        <span className="text-sm sm:text-base font-semibold">?</span>
      </button>
    );
  }
); 