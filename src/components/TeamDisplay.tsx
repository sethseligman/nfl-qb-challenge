import { getTeamLogo } from '../utils/teams';

interface TeamDisplayProps {
  team: string;
  isShuffling: boolean;
  showScore: boolean;
  totalScore: number;
  showBradyEffect: boolean;
  shufflingTeam?: string;
  startNextRound?: () => void;
  setShowBradyEffect?: (show: boolean) => void;
}

export default function TeamDisplay({
  team,
  isShuffling,
  showScore,
  totalScore,
  showBradyEffect,
  shufflingTeam,
  startNextRound,
  setShowBradyEffect
}: TeamDisplayProps) {
  return (
    <div className="relative">
      {/* Main content */}
      <div className="flex flex-col items-center justify-center gap-4 p-4">
        {/* Team logo and name */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-24 h-24 flex items-center justify-center">
            <img
              src={getTeamLogo(team)}
              alt={team}
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

        {/* Start next round button */}
        {startNextRound && (
          <button
            onClick={startNextRound}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Start Next Round
          </button>
        )}

        {/* Brady effect toggle */}
        {setShowBradyEffect && (
          <button
            onClick={() => setShowBradyEffect(!showBradyEffect)}
            className={`px-4 py-2 rounded-md transition-colors ${
              showBradyEffect
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {showBradyEffect ? 'Brady Effect: ON' : 'Brady Effect: OFF'}
          </button>
        )}
      </div>
    </div>
  );
} 