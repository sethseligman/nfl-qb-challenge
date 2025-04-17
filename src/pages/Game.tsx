import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatQBDisplayName, validateQB, qbDatabase, QBData, normalizeTeamName } from '../data/qbData';
import { getTeamLogo } from '../data/teamLogos';
import { getQBPhoto } from '../data/qbPhotos';
import { teamColors } from '../data/teamColors';
import { RulesModal } from '../components/RulesModal';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { useNavigate } from 'react-router-dom';
import type { QB } from '../store/gameStore';
import { QwertyKeyboard } from '../components/QwertyKeyboard';
import { SpecialEffects } from '../components/SpecialEffects';

const ROUNDS_PER_GAME = 20;

const NFL_TEAMS = [
  "Arizona Cardinals", "Atlanta Falcons", "Baltimore Ravens", "Buffalo Bills",
  "Carolina Panthers", "Chicago Bears", "Cincinnati Bengals", "Cleveland Browns",
  "Dallas Cowboys", "Denver Broncos", "Detroit Lions", "Green Bay Packers",
  "Houston Texans", "Indianapolis Colts", "Jacksonville Jaguars", "Kansas City Chiefs",
  "Las Vegas Raiders", "Los Angeles Chargers", "Los Angeles Rams", "Miami Dolphins",
  "Minnesota Vikings", "New England Patriots", "New Orleans Saints", "New York Giants",
  "New York Jets", "Philadelphia Eagles", "Pittsburgh Steelers", "San Francisco 49ers",
  "Seattle Seahawks", "Tampa Bay Buccaneers", "Tennessee Titans", "Washington Commanders"
];

const TeamDisplay: React.FC<{ 
  team: string | null; 
  isShuffling: boolean; 
  shufflingTeam: string | undefined;
  picks: { qb: string; team: string }[];
  startNextRound: () => void;
  setShowBradyEffect: (show: boolean) => void;
  showBradyEffect: boolean;
}> = ({ 
  team, 
  isShuffling, 
  shufflingTeam,
  picks,
  startNextRound,
  setShowBradyEffect,
  showBradyEffect
}) => {
  const [activeTooltipIndex, setActiveTooltipIndex] = useState<number | null>(null);
  const [animatingLogo, setAnimatingLogo] = useState<{
    team: string;
    startRect: DOMRect | null;
    endRect: DOMRect | null;
    targetIndex: number;
  } | null>(null);
  const centerLogoRef = useRef<HTMLDivElement>(null);
  const gridCellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  // Get team color for border
  const getTeamColorClass = (teamName: string) => {
    const colorClass = teamColors[teamName];
    if (!colorClass) return 'border-neutral-200 dark:border-neutral-700';
    return colorClass.replace('text-', 'border-');
  };

  const handleLogoClick = (index: number) => {
    setActiveTooltipIndex(prev => prev === index ? null : index);
  };

  // Handle new pick animation
  useEffect(() => {
    if (shouldAnimate && picks.length > 0 && !isShuffling && team) {
      const lastPick = picks[picks.length - 1];
      const targetIndex = picks.length - 1;
      const isBradyPick = lastPick.qb.toLowerCase().includes('brady');
      
      // Get the center logo position - using the image element
      const centerLogoImg = centerLogoRef.current?.querySelector('img');
      
      if (centerLogoImg) {
        const imgRect = centerLogoImg.getBoundingClientRect();
        
        // Use the image's actual position and dimensions
        const startRect = new DOMRect(
          imgRect.left,
          imgRect.top,
          imgRect.width,
          imgRect.height
        );
        
        // Get the target grid cell position
        const endRect = gridCellRefs.current[targetIndex]?.getBoundingClientRect() || null;

        if (startRect && endRect) {
          // For Brady picks, wait for the effect to complete (2000ms) before starting animation
          const startAnimation = () => {
            setAnimatingLogo({
              team: lastPick.team,
              startRect,
              endRect,
              targetIndex
            });

            // Remove the animating logo and start shuffling after animation completes
            setTimeout(() => {
              setAnimatingLogo(null);
              setShouldAnimate(false);
              startNextRound();
            }, 300);
          };

          if (isBradyPick) {
            // Don't start animation yet, it will be triggered after Brady effect
            return;
          } else {
            startAnimation();
          }
        }
      }
    }
  }, [shouldAnimate, picks.length, team, isShuffling, startNextRound, setShowBradyEffect]);

  // Handle Brady effect and subsequent animation
  useEffect(() => {
    if (showBradyEffect && picks.length > 0 && !isShuffling && team) {
      const lastPick = picks[picks.length - 1];
      const targetIndex = picks.length - 1;
      
      // Wait for Brady effect to complete
      setTimeout(() => {
        // Get positions after Brady effect
        const centerLogoImg = centerLogoRef.current?.querySelector('img');
        
        if (centerLogoImg) {
          const imgRect = centerLogoImg.getBoundingClientRect();
          const startRect = new DOMRect(
            imgRect.left,
            imgRect.top,
            imgRect.width,
            imgRect.height
          );
          
          const endRect = gridCellRefs.current[targetIndex]?.getBoundingClientRect() || null;

          if (startRect && endRect) {
            setShowBradyEffect(false);
            setAnimatingLogo({
              team: lastPick.team,
              startRect,
              endRect,
              targetIndex
            });

            // Remove the animating logo and start shuffling after animation completes
            setTimeout(() => {
              setAnimatingLogo(null);
              setShouldAnimate(false);
              startNextRound();
            }, 300);
          }
        }
      }, 2000);
    }
  }, [showBradyEffect, picks.length, team, isShuffling, startNextRound, setShowBradyEffect]);

  // Trigger animation when a new pick is added
  useEffect(() => {
    if (picks.length > 0 && !isShuffling) {
      setShouldAnimate(true);
    }
  }, [picks.length]);

  // Create the mirrored grid layout
  const createMirroredLayout = () => {
    // Create arrays for both sides, each with 10 slots (total 20 slots)
    const leftSide = Array(10).fill(null).map((_, idx) => {
      // First 10 picks go on the left side
      if (idx < picks.length && idx < 10) {
        // Only hide the specific logo being animated to its position
        if (animatingLogo && animatingLogo.targetIndex === idx) {
          return null;
        }
        return picks[idx];
      }
      return null;
    });
    
    const rightSide = Array(10).fill(null).map((_, idx) => {
      // Next 10 picks go on the right side
      const pickIndex = idx + 10;
      if (pickIndex < picks.length) {
        // Only hide the specific logo being animated to its position
        if (animatingLogo && animatingLogo.targetIndex === pickIndex) {
          return null;
        }
        return picks[pickIndex];
      }
      return null;
    });

    return { leftSide, rightSide };
  };

  const { leftSide, rightSide } = createMirroredLayout();

  const TeamLogo: React.FC<{ pick: { qb: string; team: string } | null, index: number }> = ({ pick, index }) => (
    <div 
      className="relative group flex justify-center items-center w-8 h-8 sm:w-12 sm:h-12"
      ref={el => gridCellRefs.current[index] = el}
    >
      {pick ? (
        <>
          <img
            src={getTeamLogo(pick.team)}
            alt={pick.team}
            className="w-8 h-8 sm:w-12 sm:h-12 object-contain hover:scale-110 transition-transform duration-150 ease-in-out"
            onClick={(e) => {
              e.stopPropagation();
              handleLogoClick(index);
            }}
          />
          <div 
            className={`absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-black text-white text-xs rounded px-2 py-1 transition whitespace-nowrap z-10
              sm:opacity-0 sm:group-hover:opacity-100
              ${activeTooltipIndex === index ? 'opacity-100' : 'opacity-0'}`}
          >
            {pick.qb}
          </div>
        </>
      ) : (
        <div className="w-full h-full rounded-full border-2 border-neutral-200 dark:border-neutral-700 opacity-25 flex items-center justify-center">
          <span className="text-xs sm:text-sm font-medium text-neutral-400 dark:text-neutral-500">
            {index + 1}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div 
      className="relative w-full py-4 sm:py-6"
      onClick={(e) => {
        if ((e.target as HTMLElement).tagName !== 'IMG') {
          setActiveTooltipIndex(null);
        }
      }}
    >
      {/* Animated Logo Clone */}
      {animatingLogo && animatingLogo.startRect && animatingLogo.endRect && (
        <div
          className="fixed pointer-events-none z-50"
          style={{
            position: 'fixed',
            width: `${animatingLogo.startRect.width}px`,
            height: `${animatingLogo.startRect.height}px`,
            left: 0,
            top: 0,
            transform: `translate3d(${animatingLogo.startRect.left}px, ${animatingLogo.startRect.top}px, 0)`,
            animation: 'move-to-grid 300ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
          }}
        >
          <style>{`
            @keyframes move-to-grid {
              0% {
                width: ${animatingLogo.startRect.width}px;
                height: ${animatingLogo.startRect.height}px;
                transform: translate3d(${animatingLogo.startRect.left}px, ${animatingLogo.startRect.top}px, 0);
              }
              to {
                width: ${animatingLogo.endRect.width}px;
                height: ${animatingLogo.endRect.height}px;
                transform: translate3d(${animatingLogo.endRect.left}px, ${animatingLogo.endRect.top}px, 0);
              }
            }
          `}</style>
          <img 
            src={getTeamLogo(animatingLogo.team)}
            alt={animatingLogo.team}
            className="w-full h-full object-contain"
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
        {/* Left Side */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {leftSide.map((pick, idx) => (
            <TeamLogo key={`left-${idx}`} pick={pick} index={idx} />
          ))}
        </div>

        {/* Center Team */}
        <div 
          ref={centerLogoRef}
          className={`relative z-10 flex flex-col items-center justify-center bg-white/80 dark:bg-black/40 backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 mx-auto lg:max-w-[400px] ${
            isShuffling ? 'scale-105 rotate-3' : ''
          } ${getTeamColorClass(shufflingTeam || team || '')}`}
          style={{ width: window.innerWidth < 640 ? 120 : 200, height: window.innerWidth < 640 ? 160 : 240 }}
        >
          <img 
            src={getTeamLogo(shufflingTeam || team || '')} 
            alt={shufflingTeam || team || ''} 
            className={`w-20 h-20 sm:w-32 sm:h-32 lg:w-40 lg:h-40 object-contain transition-all duration-300 ${
              isShuffling ? 'animate-pulse-fast scale-110 rotate-6' : 'animate-pulse-slow'
            }`}
          />
          <div className={`flex items-center justify-center w-full px-1 sm:px-3 transition-all duration-300 ${
            isShuffling ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}>
            {!isShuffling && team && (() => {
              const lastSpace = team.lastIndexOf(' ');
              const location = team.slice(0, lastSpace);
              const nickname = team.slice(lastSpace + 1);
              
              // Determine text size classes based on name length
              const getTextSizeClass = (text: string) => {
                if (text.length > 12) return 'text-xs sm:text-base lg:text-xl';
                if (text.length > 10) return 'text-sm sm:text-lg lg:text-2xl';
                return 'text-lg sm:text-2xl lg:text-3xl';
              };

              const getNicknameTextSizeClass = (text: string) => {
                if (text.length > 10) return 'text-sm sm:text-xl lg:text-2xl';
                if (text.length > 8) return 'text-base sm:text-2xl lg:text-3xl';
                return 'text-xl sm:text-3xl lg:text-4xl';
              };

              // Special handling for teams with long names
              const shouldSplitLocation = location.length > 12;
              const locationParts = shouldSplitLocation ? location.split(' ') : [location];

              return (
                <div className="w-full text-center px-0.5">
                  {shouldSplitLocation ? (
                    locationParts.map((part, index) => (
                      <div 
                        key={index}
                        className={`${getTextSizeClass(part)} leading-tight font-sans ${teamColors[team] || 'text-main dark:text-main-dark'}`}
                      >
                        {part}
                      </div>
                    ))
                  ) : (
                    <div className={`${getTextSizeClass(location)} font-sans ${teamColors[team] || 'text-main dark:text-main-dark'}`}>
                      {location}
                    </div>
                  )}
                  <div className={`${getNicknameTextSizeClass(nickname)} font-bold font-sans leading-tight ${teamColors[team] || 'text-main dark:text-main-dark'}`}>
                    {nickname}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        {/* Right Side */}
        <div className="grid grid-cols-2 gap-4 sm:gap-6">
          {rightSide.map((pick, idx) => (
            <TeamLogo key={`right-${idx}`} pick={pick} index={idx + 10} />
          ))}
        </div>
      </div>
    </div>
  );
};

const InputField: React.FC<{
  input: string;
  error: string | null;
  isValidInput: boolean | null;
  showHelpDropdown: boolean;
  availableQBs: { name: string; wins: number }[];
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleQBSelect: (qbName: string) => void;
  showScore: boolean;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  isGameOver: boolean;
}> = ({
  input,
  error,
  isValidInput,
  showHelpDropdown,
  availableQBs,
  handleInputChange,
  handleSubmit,
  handleQBSelect,
  showScore,
  setInput,
  isGameOver
}) => {
  // Helper function to capitalize first letter of each word
  const capitalizeWords = (str: string) => {
    return str.replace(/(?:^|\s)\S/g, (letter) => letter.toUpperCase());
  };

  // Function to handle keyboard button clicks
  const handleKeyPress = (key: string) => {
    if (isGameOver) return;
    setInput(prev => prev + key);
  };

  const handleBackspace = () => {
    if (isGameOver) return;
    setInput(prev => prev.slice(0, -1));
  };

  const handleKeyboardSubmit = () => {
    if (isGameOver) return;
    handleSubmit();
  };

  return (
    <div className="space-y-2 sm:space-y-4">
      <div className="bg-white/50 dark:bg-neutral-800/50 rounded-xl p-3 sm:p-4 space-y-2 shadow-[0_-1px_0_rgba(0,0,0,0.1)_inset] dark:shadow-[0_-1px_0_rgba(255,255,255,0.1)_inset]">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex gap-1 sm:gap-2">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Enter QB name or type 'help'"
              className={`flex-1 px-2 sm:px-4 py-2 sm:py-3 bg-white dark:bg-neutral-800 border ${
                isValidInput === true
                  ? 'border-green-500 dark:border-green-500/50'
                  : isValidInput === false
                  ? 'border-red-500 dark:border-red-500/50'
                  : 'border-neutral-200 dark:border-neutral-700'
              } rounded-lg text-main dark:text-main-dark focus:outline-none focus:ring-2 focus:ring-blue-500`}
              autoComplete="off"
              spellCheck={false}
              disabled={isGameOver}
              onKeyDown={(e) => {
                // Prevent any key input when Command/Meta key is pressed
                if (e.metaKey || e.ctrlKey) return;
                
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit(e);
                } else if (e.key === ' ') {
                  e.preventDefault();
                  handleKeyPress(' ');
                }
              }}
            />
            <button
              type="submit"
              className="px-3 sm:px-4 py-2 text-sm border rounded-md text-main hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:border-neutral-700 transition-colors whitespace-nowrap"
              aria-label="Submit quarterback name"
              disabled={isGameOver}
            >
              Submit
            </button>
          </div>

          {/* Feedback Messages */}
          <div className="h-6 mt-2">
            {error ? (
              <p className="text-sm font-semibold text-red-500 dark:text-red-400 animate-fade-in-down">
                Nope! Try again or type "help" for assistance
              </p>
            ) : isValidInput === true && input.length > 0 ? (
              <p className="text-sm font-semibold text-green-500 dark:text-green-400 animate-fade-in-down">
                Correct! Press Enter or Submit
              </p>
            ) : null}
          </div>

          {showHelpDropdown && availableQBs.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {availableQBs.map((qb) => (
                <button
                  key={qb.name}
                  onClick={() => handleQBSelect(qb.name)}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-700 text-main dark:text-main-dark flex justify-between items-center"
                >
                  <span>{qb.name}</span>
                  {showScore && (
                    <span className="text-muted dark:text-muted-dark">{qb.wins} wins</span>
                  )}
                </button>
              ))}
            </div>
          )}
        </form>

        {/* QWERTY Keyboard */}
        <div className="fixed bottom-0 left-0 right-0 pb-safe pt-2 bg-gradient-to-t from-white via-white to-transparent dark:from-black dark:via-black xl:relative xl:pb-0">
          <div className="max-w-[600px] mx-auto">
            <QwertyKeyboard
              onKeyPress={handleKeyPress}
              onBackspace={handleBackspace}
              onEnter={handleKeyboardSubmit}
              isDisabled={isGameOver}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const GameStats: React.FC<{ currentRound: number; totalScore: number; showScore: boolean }> = ({
  currentRound,
  totalScore,
  showScore
}) => {
  return (
    <div className="fixed lg:absolute top-0 right-0 m-4 bg-slate-100 dark:bg-neutral-800/90 backdrop-blur-sm border border-slate-200 dark:border-neutral-700 rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-2">
      <span className="text-slate-700 dark:text-slate-200">
        Round {currentRound} of {ROUNDS_PER_GAME}
      </span>
      {showScore && (
        <>
          <span className="text-slate-400 dark:text-slate-500">·</span>
          <span className="text-slate-700 dark:text-slate-200">
            Wins: {totalScore.toLocaleString()}
          </span>
        </>
      )}
    </div>
  );
};

const QBPhoto: React.FC<{ qb: string; size?: 'sm' | 'lg' }> = ({ qb, size = 'sm' }) => {
  const [showImage, setShowImage] = useState(true);
  const photoUrl = getQBPhoto(qb);

  if (!showImage || !photoUrl) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-full ${
        size === 'sm' ? 'w-6 h-6' : 'w-16 h-16'
      }`}>
        <span className={`text-muted dark:text-muted-dark ${size === 'sm' ? 'text-xs' : 'text-lg'}`}>
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

const PicksList: React.FC<{ picks: QB[]; showScore: boolean }> = ({
  picks,
  showScore
}) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-main dark:text-main-dark">Your Picks</h3>
      <div className="bg-white dark:bg-black rounded-lg border border-neutral-200 dark:border-neutral-800 divide-y divide-neutral-200 dark:divide-neutral-800">
        {picks.map((pick, idx) => (
          <div key={idx} className="p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <QBPhoto qb={pick.qb} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-main dark:text-main-dark">
                    {pick.displayName}
                  </span>
                  {pick.usedHelp && (
                    <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                      SOS
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted dark:text-muted-dark flex items-center gap-1">
                  <img src={getTeamLogo(pick.team)} alt={pick.team} className="w-4 h-4" />
                  <span>{pick.team}</span>
                </div>
              </div>
            </div>
            {showScore && (
              <div className="text-lg font-medium text-main dark:text-main-dark">
                {pick.wins}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

interface GameProps {
  // ... existing props
}

interface FormSubmitEvent extends FormEvent {
  preventDefault: () => void;
}

export const Game: React.FC = () => {
  const {
    currentTeam,
    picks,
    isGameOver,
    showScore,
    toggleScore,
    usedQBs,
    addPick,
    setCurrentTeam,
    totalScore,
    initializeGame,
    setIsGameOver,
    setCurrentPickUsedHelp,
    setShowHelp
  } = useGameStore();

  const { addGameRecord } = useLeaderboardStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const [availableQBs, setAvailableQBs] = useState<{ name: string; wins: number }[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shufflingTeam, setShufflingTeam] = useState<string | undefined>(undefined);
  const [isValidInput, setIsValidInput] = useState<boolean | null>(null);
  const [showRules, setShowRules] = useState(true);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [isInitialStart, setIsInitialStart] = useState(true);
  const [showBradyEffect, setShowBradyEffect] = useState(false);
  const navigate = useNavigate();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    initializeGame();
    setShowRules(true);
    setIsInitialStart(true);
  }, []);

  const startGame = () => {
    setShowRules(false);
    setIsShuffling(true);
    setTimeout(() => {
      const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
      setCurrentTeam(randomTeam);
    }, 1500);
  };

  useEffect(() => {
    if (isShuffling) {
      const fastInterval = setInterval(() => {
        const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
        setShufflingTeam(randomTeam);
      }, 50);

      const slowDownTimeout = setTimeout(() => {
        clearInterval(fastInterval);
        const slowInterval = setInterval(() => {
          const randomTeam = NFL_TEAMS[Math.floor(Math.random() * NFL_TEAMS.length)];
          setShufflingTeam(randomTeam);
        }, 200);

        const finalTimeout = setTimeout(() => {
          clearInterval(slowInterval);
          setIsShuffling(false);
          setShufflingTeam(undefined);
        }, 500);

        return () => {
          clearInterval(slowInterval);
          clearTimeout(finalTimeout);
        };
      }, 1000);

      return () => {
        clearInterval(fastInterval);
        clearTimeout(slowDownTimeout);
      };
    }
  }, [isShuffling]);

  useEffect(() => {
    if (isGameOver) {
      // Check if score would make it to leaderboard without actually creating an entry
      const wouldMakeLeaderboard = addGameRecord({
        playerName: '',
        score: totalScore,
        picks: picks.map(pick => ({
          qb: pick.qb,
          team: pick.team,
          displayName: pick.displayName,
          wins: pick.wins,
          usedHelp: pick.usedHelp
        }))
      });

      if (wouldMakeLeaderboard) {
        setShowLeaderboardModal(true);
      }
    }
  }, [isGameOver]);

  const handleReset = () => {
    initializeGame();
    setShowRules(true);
    setIsInitialStart(true);
    setInput('');
    setError(null);
    setIsValidInput(null);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
  };

  const handleShowRules = () => {
    setShowRules(true);
    setIsInitialStart(false);
  };

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();
    if (isGameOver || !input.trim()) return;
    
    if (input.toLowerCase().trim() === 'help') {
      setShowHelp(true);
      setInput('');
      return;
    }

    const validationResult = validateQB(input, currentTeam || '');
    if (validationResult && !usedQBs.includes(validationResult.name)) {
      const { name, wins } = validationResult;
      const displayName = formatQBDisplayName(input, name);
      addPick(name, wins, displayName);
      setInput('');
      setError(null);
      setIsValidInput(null);
      setShowHelpDropdown(false);
      setAvailableQBs([]);

      // Check if this was the last round
      if (picks.length >= ROUNDS_PER_GAME - 1) {
        setIsGameOver(true);
        return;
      }

      // If it's Brady, show effect first
      if (name.toLowerCase().includes('brady')) {
        setShowBradyEffect(true);
      }
      // Animation and shuffling will be handled by the useEffect
    } else {
      setError('Invalid quarterback name or already used');
      setIsValidInput(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInput(newValue);
    setError(null);
    
    if (newValue.toLowerCase().trim() === 'help') {
      setIsValidInput(true);
      return;
    }
    
    if (newValue.trim() === '') {
      setIsValidInput(null);
    } else {
      const validationResult = validateQB(newValue, currentTeam || '');
      const isValid = validationResult && !usedQBs.includes(validationResult.name);
      setIsValidInput(isValid);
    }
    
    setShowHelpDropdown(false);
    setAvailableQBs([]);
  };

  const handleQBSelect = (qbName: string) => {
    setInput(qbName);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
    const validationResult = validateQB(qbName, currentTeam || '');
    const isValid = validationResult && !usedQBs.includes(validationResult.name);
    setIsValidInput(isValid);
  };

  const handleLeaderboardSubmit = (playerName: string) => {
    addGameRecord({
      playerName,
      score: totalScore,
      picks: picks.map(pick => ({
        qb: pick.qb,
        team: pick.team,
        displayName: pick.displayName,
        wins: pick.wins,
        usedHelp: pick.usedHelp
      }))
    });
    setShowLeaderboardModal(false);
    handleReset();
    navigate('/leaderboard');
  };

  const handleLeaderboardSkip = () => {
    setShowLeaderboardModal(false);
  };

  // Remove the global keyboard event listener since we're handling it in the input field
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .football-pill {
        width: 60px;
        height: 30px;
        border-radius: 60% 60% 60% 60% / 90% 90% 90% 90%;
        background-color: #b87333;
        border: 2px solid #fff;
        box-shadow: 0 2px 6px rgba(0,0,0,0.12);
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  useEffect(() => {
    // Scroll input into view when keyboard appears
    if (inputContainerRef.current && keyboardHeight > 0) {
      inputContainerRef.current.scrollIntoView({ 
        behavior: "smooth", 
        block: "center" 
      });
    }
  }, [keyboardHeight]);

  if (isGameOver) {
    return (
      <>
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-6 text-center">
            <h2 className="text-2xl font-sans text-main dark:text-main-dark mb-4">Game Over!</h2>
            <p className="text-muted dark:text-muted-dark mb-6">
              Your final score: {totalScore}
              {picks.some(pick => pick.usedHelp) && (
                <span className="inline-flex items-center gap-2 ml-2">
                  <span className="text-xs bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded">
                    SOS
                  </span>
                  <span className="text-sm">Used help during game</span>
                </span>
              )}
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleReset}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Play Again
              </button>
              <button
                onClick={() => {
                  handleReset();
                  navigate('/leaderboard');
                }}
                className="px-4 py-2 border rounded-lg text-main dark:text-main-dark hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                View Leaderboard
              </button>
            </div>
          </div>
        </div>

        {showLeaderboardModal && (
          <LeaderboardModal
            onSubmit={handleLeaderboardSubmit}
            onCancel={handleLeaderboardSkip}
          />
        )}
      </>
    );
  }

  return (
    <div 
      className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-slate-100"
      style={{ paddingBottom: `${keyboardHeight + 16}px` }}
    >
      <SpecialEffects isVisible={showBradyEffect} />
      {/* Main game content and pick history container */}
      <div className="flex flex-col xl:flex-row xl:justify-between xl:gap-x-8 xl:items-start relative">
        {/* Main game content */}
        <div className="flex-1 relative">
          <GameStats
            currentRound={picks.length + 1}
            totalScore={totalScore}
            showScore={showScore}
          />
          <TeamDisplay
            team={currentTeam}
            isShuffling={isShuffling}
            shufflingTeam={shufflingTeam}
            picks={picks.map(pick => ({ qb: pick.displayName, team: pick.team }))}
            startNextRound={startNextRound}
            setShowBradyEffect={setShowBradyEffect}
            showBradyEffect={showBradyEffect}
          />
          <div className="max-w-4xl mx-auto px-2 sm:px-6 py-2 sm:py-6 lg:py-8 mb-keyboard">
            <div className="space-y-2 sm:space-y-3 lg:space-y-4">
              {/* Header */}
              <div className="flex justify-between items-center">
                <div className="flex flex-col">
                  <h1 className="text-lg sm:text-2xl font-bold font-sans bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent">
                    Quarterback
                  </h1>
                  <h2 className="text-base sm:text-xl font-medium text-main dark:text-main-dark -mt-1">
                    Career Wins Challenge
                  </h2>
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={handleShowRules}
                    className="text-sm text-muted dark:text-muted-dark hover:text-main dark:hover:text-main-dark"
                  >
                    Rules
                  </button>
                  <button
                    onClick={toggleScore}
                    className="text-sm text-muted dark:text-muted-dark hover:text-main dark:hover:text-main-dark"
                  >
                    {showScore ? 'Hide Score' : 'Show Score'}
                  </button>
                </div>
              </div>

              {/* Game Stats & Input Section */}
              {!showRules && (
                <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-2 sm:p-4 space-y-2 sm:space-y-3">
                  <InputField
                    input={input}
                    error={error}
                    isValidInput={isValidInput}
                    showHelpDropdown={showHelpDropdown}
                    availableQBs={availableQBs}
                    handleInputChange={handleInputChange}
                    handleSubmit={handleSubmit}
                    handleQBSelect={handleQBSelect}
                    showScore={showScore}
                    setInput={setInput}
                    isGameOver={isGameOver}
                  />
                </div>
              )}

              {/* Footer Actions */}
              {!showRules && (
                <div className="flex justify-end mt-1">
                  <button
                    onClick={handleReset}
                    className="text-sm text-muted dark:text-muted-dark hover:text-main dark:hover:text-main-dark"
                  >
                    New Game
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pick History Grid */}
        {!showRules && picks.length > 0 && (
          <div className="xl:w-[320px] xl:sticky xl:top-4 xl:pt-4 xl:border-l xl:border-neutral-200 dark:xl:border-neutral-800 xl:pl-8">
            <h3 className="text-sm font-medium text-muted dark:text-muted-dark mb-3 hidden xl:block">
              Pick History
            </h3>
            <div className="bg-neutral-50 dark:bg-neutral-900 rounded-xl p-3 sm:p-4">
              <PicksList picks={picks} showScore={showScore} />
            </div>
          </div>
        )}
      </div>

      {showRules && (
        <RulesModal 
          onClose={isInitialStart ? startGame : () => setShowRules(false)} 
          isInitialStart={isInitialStart}
        />
      )}

      {showLeaderboardModal && (
        <LeaderboardModal
          onSubmit={handleLeaderboardSubmit}
          onCancel={handleLeaderboardSkip}
        />
      )}

      <div 
        ref={inputContainerRef}
        className="w-full max-w-[600px] mx-auto px-4 mt-4"
      >
        <form ref={formRef} onSubmit={handleSubmit}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a QB name..."
            className="w-full px-4 py-2 rounded-lg bg-slate-100 dark:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </form>
      </div>

      <QwertyKeyboard
        onKeyPress={handleKeyPress}
        onBackspace={handleBackspace}
        onEnter={handleKeyboardSubmit}
        isDisabled={isGameOver}
        onHeightChange={setKeyboardHeight}
      />
    </div>
  );
};