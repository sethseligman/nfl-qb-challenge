import React, { useState, useEffect, useRef } from 'react';
import { useGameStore } from '../store/gameStore';
import { formatQBDisplayName, validateQB, qbDatabase, QBData, normalizeTeamName, findClosestMatch } from '../data/qbData';
import { getTeamLogo } from '../data/teamLogos';
import { teamColors } from '../data/teamColors';
import { RulesModal } from '../components/RulesModal';
import { useLeaderboardStore } from '../store/leaderboardStore';
import { LeaderboardModal } from '../components/LeaderboardModal';
import { useNavigate } from 'react-router-dom';
import { QwertyKeyboard } from '../components/QwertyKeyboard';
import { ROUNDS_PER_GAME } from '../constants';
import { CORRECT_FEEDBACK_MESSAGES, INCORRECT_FEEDBACK_MESSAGES, ALREADY_USED_FEEDBACK_MESSAGES, ASSISTED_FEEDBACK_MESSAGES } from '../constants/feedbackMessages';
import { getRandomFeedbackMessage } from '../utils/feedback';
import { SpecialEffects } from '../components/SpecialEffects';
import { HalftimeEffect } from '../components/HalftimeEffect';
import { HelpMenu } from '../components/HelpMenu';
import { AnimatedInfoButton } from '../components/AnimatedInfoButton';
import { GameOver } from '../components/GameOver';
import { selectWeightedTeam, updateRecentTeams } from '../utils/teamSelection';

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

// Helper function to capitalize first letter of each word
const capitalizeWords = (str: string) => {
  return str.replace(/(?:^|\s)\S/g, (letter) => letter.toUpperCase());
};

const TeamDisplay: React.FC<{ 
  team: string | null; 
  isShuffling: boolean; 
  shufflingTeam: string | undefined;
  picks: { qb: string; team: string }[];
  startNextRound: () => void;
  showScore: boolean;
  totalScore: number;
  getTeamColorClass: (teamName: string) => string;
}> = ({ 
  team, 
  isShuffling, 
  shufflingTeam,
  picks,
  startNextRound,
  showScore,
  totalScore,
  getTeamColorClass
}) => {
  const centerLogoRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col h-[260px] bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      {/* Team logo and name */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24 flex items-center justify-center">
          <img
            src={getTeamLogo(team || '')}
            alt={team || ''}
            className={`w-full h-full object-contain transition-opacity duration-300 ${
              isShuffling ? 'opacity-0' : 'opacity-100'
            }`}
          />
          {shufflingTeam && (
            <img
              src={getTeamLogo(shufflingTeam)}
              alt={shufflingTeam}
              className={`absolute inset-0 w-full h-full object-contain transition-opacity duration-300 ${
                isShuffling ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
        </div>
        <h2 className="text-xl font-bold text-center">{team}</h2>
      </div>

      {/* Score display */}
      {showScore && (
        <div className="text-4xl font-bold text-center">
          {totalScore}
        </div>
      )}
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
  isGameOver: boolean;
  feedback: string | null;
  usedQBs: string[];
  currentTeam: string | null;
  setShowHelpDropdown: (show: boolean) => void;
  setAvailableQBs: (qbs: { name: string; wins: number }[]) => void;
  setCurrentPickUsedHelp: () => void;
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
  isGameOver,
  feedback,
  usedQBs,
  currentTeam,
  setShowHelpDropdown,
  setAvailableQBs,
  setCurrentPickUsedHelp
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showHelpHint, setShowHelpHint] = useState(false);
  const [wrongAnswerCount, setWrongAnswerCount] = useState(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const wrongAnswerTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset inactivity timer when input changes
  useEffect(() => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Don't set timer if there's already input, game is over, or help dropdown is open
    if (input.trim() || isGameOver || showHelpDropdown) {
      setShowHelpHint(false);
      return;
    }

    // Set new timer
    inactivityTimerRef.current = setTimeout(() => {
      setShowHelpHint(true);
      // Hide hint after 5 seconds if not clicked
      setTimeout(() => setShowHelpHint(false), 5000);
    }, 10000); // 10 seconds of inactivity

    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, [input, isGameOver, showHelpDropdown]);

  // Track wrong answers
  useEffect(() => {
    if (error) {
      setWrongAnswerCount(prev => {
        const newCount = prev + 1;
        console.log('Wrong answer count:', newCount);
        if (newCount >= 2) {
          console.log('Scheduling help hint after feedback clears');
          // Wait for feedback to clear before showing help hint
          setTimeout(() => {
            console.log('Showing help hint after feedback cleared');
            setShowHelpHint(true);
            if (wrongAnswerTimerRef.current) {
              clearTimeout(wrongAnswerTimerRef.current);
            }
            wrongAnswerTimerRef.current = setTimeout(() => {
              setShowHelpHint(false);
              // Reset wrong answer count after help hint is shown
              setWrongAnswerCount(0);
            }, 5000);
          }, 2100); // Wait slightly longer than feedback duration (2000ms)
          return 0; // Reset count immediately after scheduling the hint
        }
        return newCount;
      });
    } else if (feedback && !error) {
      console.log('Resetting wrong answer count after correct answer');
      setWrongAnswerCount(0);
    }

    return () => {
      if (wrongAnswerTimerRef.current) {
        clearTimeout(wrongAnswerTimerRef.current);
      }
    };
  }, [error, feedback]);

  // Reset help hint when help is used
  useEffect(() => {
    if (showHelpDropdown) {
      setShowHelpHint(false);
      setWrongAnswerCount(0);
    }
  }, [showHelpDropdown]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full max-w-lg mx-auto">
      <form onSubmit={handleSubmit} className="relative">
        <div className="flex gap-2">
          <div className="relative flex-1">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
              disabled={isGameOver || showHelpDropdown}
              readOnly={isMobile}
              placeholder={feedback || "Guess a Quarterback"}
              className={`w-full h-10 px-4 bg-white dark:bg-neutral-800 border rounded-lg text-black dark:text-white 
                ${error || (feedback && ALREADY_USED_FEEDBACK_MESSAGES.includes(feedback)) ? 'animate-shake ' : ''}
                ${error ? 'border-red-500 dark:border-red-500' : 
                  feedback && ALREADY_USED_FEEDBACK_MESSAGES.includes(feedback) ? 'border-red-500 dark:border-red-500' :
                  feedback && !error ? 'border-emerald-500 dark:border-emerald-500' : 
                  isValidInput ? 'border-emerald-500 dark:border-emerald-500' : 
                  'border-neutral-200 dark:border-neutral-700'} 
                ${error ? 'placeholder:text-red-500 dark:placeholder:text-red-400' : 
                  feedback && ALREADY_USED_FEEDBACK_MESSAGES.includes(feedback) ? 'placeholder:text-red-500 dark:placeholder:text-red-400' :
                  feedback && !error ? 'placeholder:text-green-500 dark:placeholder:text-green-400' : 
                  'placeholder:text-black/60 dark:placeholder:text-white/60'}
                ${isMobile ? 'cursor-default' : showHelpDropdown ? 'cursor-not-allowed' : 'cursor-text'}
                focus:outline-none focus:ring-2 focus:ring-emerald-500/20 disabled:opacity-100`}
            />
        {showHelpDropdown && availableQBs.length > 0 && (
          <div className="relative">
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-lg max-h-[252px] overflow-y-scroll [&::-webkit-scrollbar]:block [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:bg-neutral-300 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-600 [&::-webkit-scrollbar-track]:bg-neutral-100 dark:[&::-webkit-scrollbar-track]:bg-neutral-800">
            {availableQBs.map((qb) => (
              <button
                key={qb.name}
                onClick={() => handleQBSelect(qb.name)}
                  className="w-full text-left px-4 py-2 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-main dark:text-main-dark flex justify-between items-center"
              >
                <span>{qb.name}</span>
                {showScore && (
                  <span className="text-muted dark:text-muted-dark">{qb.wins} wins</span>
                )}
              </button>
            ))}
          </div>
      </div>
      )}
    </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isGameOver || !isValidInput || feedback !== null}
              title={!isValidInput ? "Enter a valid QB name" : undefined}
              className={`h-10 px-3 border rounded-lg text-sm text-main dark:text-main-dark hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors whitespace-nowrap 
                ${isValidInput && feedback === null ? 'border-emerald-500 dark:border-emerald-500' : 'border-neutral-200 dark:border-neutral-700'}
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent disabled:border-neutral-200 dark:disabled:border-neutral-700`}
            >
              Submit
            </button>
            <button
              type="button"
              onClick={() => {
                setShowHelpHint(false);
                setShowHelpDropdown(true);
                const availableQBsForTeam = Object.entries(qbDatabase)
                  .filter(([name, data]: [string, QBData]) => {
                    const normalizedCurrentTeam = normalizeTeamName(currentTeam || '');
                    const normalizedQbTeams = data.teams.map(normalizeTeamName);
                    return normalizedQbTeams.includes(normalizedCurrentTeam) && !usedQBs.includes(name);
                  })
                  .map(([name, data]: [string, QBData]) => ({ name, wins: data.wins }))
                  .sort(() => Math.random() - 0.5);
                setAvailableQBs(availableQBsForTeam);
                setCurrentPickUsedHelp();
              }}
              disabled={showHelpDropdown}
              className={`h-10 w-10 flex items-center justify-center border border-neutral-200 dark:border-neutral-700 rounded-lg text-sm text-neutral-500 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 transition-colors group relative
                ${showHelpHint && !showHelpDropdown ? 'animate-wiggle' : ''}
                ${showHelpDropdown ? 'opacity-50 cursor-not-allowed hover:bg-transparent dark:hover:bg-transparent' : ''}`}
              aria-label="Need help?"
              data-wrong-answers={wrongAnswerCount}
            >
              <span className="text-base">💡</span>
              {/* Desktop hover tooltip */}
              <span className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs text-white bg-black rounded whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 hidden sm:block ${!showHelpDropdown && 'group-hover:opacity-100'}`}>
                Need help?
          </span>
              {/* Animated hint tooltip */}
              {showHelpHint && !showHelpDropdown && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 animate-fade-in">
                  <div className="relative bg-blue-500 text-white text-xs px-3 py-1.5 rounded-lg whitespace-nowrap">
                    Need some help?
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-blue-500"></div>
        </div>
              </div>
            )}
            </button>
          </div>
        </div>
    </form>
    </div>
  );
};

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
    setCurrentPickUsedHelp
  } = useGameStore();

  const { addGameRecord } = useLeaderboardStore();
  const [input, setInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [showHelpDropdown, setShowHelpDropdown] = useState(false);
  const [availableQBs, setAvailableQBs] = useState<{ name: string; wins: number }[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [shufflingTeam, setShufflingTeam] = useState<string | undefined>(undefined);
  const [isValidInput, setIsValidInput] = useState<boolean | null>(null);
  const [showRules, setShowRules] = useState(true);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [isInitialStart, setIsInitialStart] = useState(true);
  const navigate = useNavigate();
  const [isBradyEffectActive, setIsBradyEffectActive] = useState(false);
  const [showHalftimeEffect, setShowHalftimeEffect] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [helpMenuPosition, setHelpMenuPosition] = useState({ top: 0, right: 0 });
  const helpButtonRef = useRef<HTMLButtonElement>(null);
  const [recentTeams, setRecentTeams] = useState<string[]>([]);

  useEffect(() => {
    initializeGame();
    setShowRules(true);
    setIsInitialStart(true);
  }, []);

  const startGame = () => {
    setShowRules(false);
    setIsInitialStart(false);
    
    // Start shuffling animation
    setIsShuffling(true);
    const newTeam = selectWeightedTeam(recentTeams, NFL_TEAMS);
    setShufflingTeam(newTeam);
    
    // After animation, set the actual team
    setTimeout(() => {
      setIsShuffling(false);
      setShufflingTeam(undefined);
      setCurrentTeam(newTeam);
      setRecentTeams([newTeam]);
    }, 1000);
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
    setShowRules(false);
    setIsInitialStart(false);
    initializeGame();
    setInput('');
    setError(null);
    setFeedback(null);
    setIsValidInput(null);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
    setCurrentPickUsedHelp();
    setIsGameOver(false);
    setShowLeaderboardModal(false);
    toggleScore(); // This will set showScore back to false
    setRecentTeams([]); // Reset recent teams history
    const newTeam = selectWeightedTeam([], NFL_TEAMS);
    setCurrentTeam(newTeam);
    setRecentTeams([newTeam]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('Input changed:', newValue);
    
    // Apply the same capitalization as the on-screen keyboard
    const capitalized = capitalizeWords(newValue);
    setInput(capitalized);
    
    // Reset both error and feedback when user starts typing
    setError(null);
    setFeedback(null);
    
    if (capitalized.trim() === '') {
      setIsValidInput(null);
    } else {
      // First-level validation: Only check if QB exists using findClosestMatch
      const matchedName = findClosestMatch(capitalized);
      // Enable submit button for any valid QB name, even if already used
      const isValid = matchedName !== null;
      console.log('Desktop validation:', { input: capitalized, matchedName, isValid });
      setIsValidInput(isValid);
    }
    
    setShowHelpDropdown(false);
    setAvailableQBs([]);
  };

  // Keyboard handlers
  const handleKeyPress = (key: string) => {
    const newValue = input + key.toLowerCase();
    const capitalized = capitalizeWords(newValue);
    setInput(capitalized);
    
    // Reset both error and feedback when user types
    setError(null);
    setFeedback(null);
    
    if (capitalized.trim() === '') {
      setIsValidInput(null);
    } else {
      // First-level validation: Only check if QB exists using findClosestMatch
      const matchedName = findClosestMatch(capitalized);
      // Enable submit button for any valid QB name, even if already used
      const isValid = matchedName !== null;
      console.log('Desktop validation:', { input: capitalized, matchedName, isValid });
      setIsValidInput(isValid);
    }
  };

  const handleBackspace = () => {
    const newValue = capitalizeWords(input.slice(0, -1));
    setInput(newValue);
    
    // Reset both error and feedback when user types
    setError(null);
    setFeedback(null);
    
    if (newValue.trim() === '') {
      setIsValidInput(null);
    } else {
      // First-level validation: Only check if QB exists using findClosestMatch
      const matchedName = findClosestMatch(newValue);
      // Enable submit button for any valid QB name, even if already used
      const isValid = matchedName !== null;
      console.log('Desktop validation:', { input: newValue, matchedName, isValid });
      setIsValidInput(isValid);
    }
  };

  const handleKeyboardEnter = () => {
    if (isValidInput) {
      handleSubmit(new Event('submit') as any);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submit triggered with input:', input);
    
    // Prevent submission during any effect
    if (isBradyEffectActive || showHalftimeEffect) {
      console.log('Effect active, preventing submission');
      return;
    }

    // Get the matched QB name from first validation
    const matchedName = findClosestMatch(input);
    if (!matchedName) {
      // This shouldn't happen since submit button should be disabled
      console.log('No QB match found for:', input);
      return;
    }

    // Check if QB is already used first
    if (usedQBs.includes(matchedName)) {
      // QB already used - show custom feedback but don't increment round
      console.log('QB already used, showing already-used feedback');
      const feedbackMsg = getRandomFeedbackMessage(ALREADY_USED_FEEDBACK_MESSAGES);
      setFeedback(feedbackMsg);
      // Clear input and validation state
      setInput('');
      setIsValidInput(null);
      // Reset feedback after duration
      setTimeout(() => {
        setFeedback(null);
      }, 2000);
      return;
    }

    // If QB not used, then check team validation
    const validationResult = validateQB(matchedName, currentTeam || '');
    console.log('Validation result:', validationResult);

    if (!validationResult) {
      // QB exists but didn't play for this team
      const feedbackMsg = getRandomFeedbackMessage(INCORRECT_FEEDBACK_MESSAGES);
      setError('Wrong team');
      setFeedback(feedbackMsg);
      // Clear input and validation state
      setInput('');
      setIsValidInput(null);
      // Reset error state after feedback duration
      setTimeout(() => {
        setError(null);
        setFeedback(null);
      }, 2000);
      return;
    }

    // Correct guess - right team and not used
      const { name, wins } = validationResult;
      const displayName = formatQBDisplayName(input, name);
    completePick(name, wins, displayName, false);
  };

  // Function to complete pick (used for both Brady and normal submissions)
  const completePick = (name: string, wins: number, displayName: string, usedHelp: boolean = false) => {
    // Use assisted feedback messages if this pick used help
    const feedbackMsg = getRandomFeedbackMessage(
      usedHelp ? ASSISTED_FEEDBACK_MESSAGES : CORRECT_FEEDBACK_MESSAGES
    );
    setFeedback(feedbackMsg);
    
    // Clear input and validation state
      setInput('');
      setIsValidInput(null);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
    setIsValidInput(true);

    // Reset validation state after feedback duration
      setTimeout(() => {
      setIsValidInput(null);
    }, 2000);

    const isBradyPick = name.toLowerCase().includes('brady');
    const isHalftimePick = picks.length === Math.floor(ROUNDS_PER_GAME / 2) - 1;

    // For Brady picks, delay adding the pick until after the effect
    if (isBradyPick) {
      setIsBradyEffectActive(true);
      setTimeout(() => {
        setIsBradyEffectActive(false);
        // Add the pick after the Brady effect
        addPick(name, wins, displayName);
      }, 2000);
    } else {
      // For non-Brady picks, add immediately
      addPick(name, wins, displayName);
    }
    
    // Check if this was the last round
    if (picks.length >= ROUNDS_PER_GAME - 1) {
        setIsGameOver(true);
      return;
    }

    // Handle halftime effect
    if (isHalftimePick) {
      if (isBradyPick) {
        // Brady at halftime - wait for Brady effect then show halftime
        setTimeout(() => {
          setShowHalftimeEffect(true);
          setTimeout(() => {
            setShowHalftimeEffect(false);
          }, 2500);
        }, 2000);
    } else {
        // Just halftime
        setShowHalftimeEffect(true);
        setTimeout(() => {
          setShowHalftimeEffect(false);
        }, 2500);
      }
    }
  };

  const handleQBSelect = (qbName: string) => {
    setInput(qbName);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
    setCurrentPickUsedHelp(); // Mark that help was used for this pick
    
    // Get the QB data and validate
    const matchedName = findClosestMatch(qbName);
    if (!matchedName) return;
    
    const qbData = qbDatabase[matchedName];
    if (!qbData) return;
    
    // Check if QB is valid for current team
    const isValidForTeam = validateQB(matchedName, currentTeam || '');
    if (!isValidForTeam) {
      setError('This QB never played for this team');
      setIsValidInput(false);
      return;
    }
    
    // Check if QB was already used
    if (usedQBs.includes(matchedName)) {
      setError(null);
      setFeedback(getRandomFeedbackMessage(ALREADY_USED_FEEDBACK_MESSAGES));
      setIsValidInput(false);
      return;
    }
    
    // Complete the pick with formatted display name
    completePick(matchedName, qbData.wins, formatQBDisplayName(qbName, matchedName), true);
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

  const startNextRound = () => {
    if (isShuffling) return;
    
    setIsShuffling(true);
    const newTeam = selectWeightedTeam(recentTeams, NFL_TEAMS);
    setShufflingTeam(newTeam);
    
    setTimeout(() => {
      setIsShuffling(false);
      setShufflingTeam(undefined);
      setCurrentTeam(newTeam);
      setRecentTeams(prevTeams => updateRecentTeams(prevTeams, newTeam));
      setInput('');
      setError(null);
      setFeedback(null);
      setIsValidInput(null);
    setShowHelpDropdown(false);
    setAvailableQBs([]);
    }, 1000);
  };

  // Remove the global keyboard event listener since we're handling it in the input field
  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      @keyframes score-pop {
        0% {
          opacity: 0;
          transform: scale(0.5) translateY(0);
        }
        20% {
          opacity: 1;
          transform: scale(1.2) translateY(0);
        }
        60% {
          opacity: 1;
          transform: scale(1) translateY(-20px);
        }
        100% {
          opacity: 0;
          transform: scale(1) translateY(-40px);
        }
      }
      
      .animate-score-pop {
        animation: score-pop 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
      }
      
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
      
      @keyframes wiggle {
        0%, 100% { transform: rotate(0deg); }
        25% { transform: rotate(-5deg); }
        75% { transform: rotate(5deg); }
      }
      
      @keyframes shake {
        0%, 100% { transform: translateX(0); }
        10% { transform: translateX(-6px); }
        30% { transform: translateX(6px); }
        50% { transform: translateX(-4px); }
        70% { transform: translateX(4px); }
        90% { transform: translateX(-2px); }
      }
      
      .animate-wiggle {
        animation: wiggle 0.5s ease-in-out infinite;
      }
      
      .animate-shake {
        animation: shake 0.25s cubic-bezier(.36,.07,.19,.97) both;
      }
      
      @keyframes fade-in {
        from { opacity: 0; transform: translate(-50%, 10px); }
        to { opacity: 1; transform: translate(-50%, 0); }
      }
      
      .animate-fade-in {
        animation: fade-in 0.3s ease-out forwards;
      }
    `;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  const handleHelpButtonClick = () => {
    if (helpButtonRef.current) {
      const rect = helpButtonRef.current.getBoundingClientRect();
      setHelpMenuPosition({
        top: rect.bottom,
        right: window.innerWidth - rect.right
      });
      setShowHelpMenu(true);
    }
  };

  // Get team color for border
  const getTeamColorClass = (teamName: string) => {
    const colorClass = teamColors[teamName];
    if (!colorClass) return 'border-neutral-200 dark:border-neutral-700';
    return colorClass.replace('text-', 'border-');
  };

  if (isGameOver) {
    const bestPick = picks.reduce((best, current) => {
      if (!best || current.wins > best.wins) {
        return { name: current.displayName, wins: current.wins };
      }
      return best;
    }, null as { name: string; wins: number } | null);

    return (
      <GameOver
        totalScore={totalScore}
        bestPick={bestPick}
        usedHelp={picks.some(pick => pick.usedHelp)}
        isTopTen={showLeaderboardModal}
        topTenThreshold={2321} // TODO: Make this dynamic based on actual leaderboard
        onPlayAgain={handleReset}
        onSubmitScore={handleLeaderboardSubmit}
        onSkipLeaderboard={handleLeaderboardSkip}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md mx-auto">
        {/* Top row with team display and QB roster */}
        <div className="flex gap-4 mb-4">
          {/* Left column - Team shuffler */}
          <div className="w-1/2">
            <TeamDisplay
              team={currentTeam}
              isShuffling={isShuffling}
              shufflingTeam={shufflingTeam}
              picks={picks}
              startNextRound={startNextRound}
              showScore={showScore}
              totalScore={totalScore}
              getTeamColorClass={getTeamColorClass}
            />
          </div>

          {/* Right column - QB roster list */}
          <div className="w-1/2 h-[260px] overflow-y-auto bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <div className="space-y-2">
              {picks.map((pick, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg border-2 ${getTeamColorClass(pick.team)}`}
                >
                  <img
                    src={getTeamLogo(pick.team)}
                    alt={pick.team}
                    className="w-8 h-8 object-contain"
                  />
                  <span className="text-sm font-medium">{pick.qb}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom section - Input field and keyboard */}
        <div className="space-y-4">
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
            isGameOver={isGameOver}
            feedback={feedback}
            usedQBs={usedQBs}
            currentTeam={currentTeam}
            setShowHelpDropdown={setShowHelpDropdown}
            setAvailableQBs={setAvailableQBs}
            setCurrentPickUsedHelp={setCurrentPickUsedHelp}
          />
          <QwertyKeyboard
            onKeyPress={handleKeyPress}
            onBackspace={handleBackspace}
            onEnter={handleKeyboardEnter}
          />
        </div>
      </div>
    </div>
  );
};