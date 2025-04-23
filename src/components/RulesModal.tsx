import React from 'react';

interface RulesModalProps {
  onClose: () => void;
  isInitialStart?: boolean;
}

export const RulesModal: React.FC<RulesModalProps> = ({ onClose, isInitialStart = false }) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start justify-center z-50 pt-4 sm:pt-20 px-3 sm:p-4">
      <div className="bg-white dark:bg-neutral-900 rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="p-3 sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-2 sm:mb-3">
            <h2 className="text-lg sm:text-2xl font-bold text-main dark:text-main-dark">How to Play</h2>
            {!isInitialStart && (
              <button
                onClick={onClose}
                className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                aria-label="Close rules"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Content */}
          <div className="space-y-3 sm:space-y-4 text-sm">
            {/* The Goal */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-main dark:text-main-dark mb-0.5 sm:mb-1">
                The Goal
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Rack up <span className="font-semibold text-blue-600 dark:text-blue-400">2,500 career wins</span> in just 20 picks.
              </p>
            </section>

            {/* How to Play */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-main dark:text-main-dark mb-0.5 sm:mb-1">
                How to Play
              </h3>
              <ul className="text-sm text-neutral-600 dark:text-neutral-400 space-y-1 sm:space-y-1.5 list-disc pl-4">
                <li>Each round shows a random NFL team</li>
                <li>Name any QB who played for that team</li>
                <li>Earn their total career wins across all teams</li>
                <li>No repeats allowed</li>
              </ul>
            </section>

            {/* Feedback */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-main dark:text-main-dark mb-0.5 sm:mb-1">
                Feedback
              </h3>
              <div className="grid grid-cols-3 gap-1 sm:gap-4">
                <div className="flex items-start gap-1.5">
                  <span className="text-emerald-500 mt-0.5 text-base sm:text-lg">✓</span>
                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-sm block">Correct</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">QB played for team</span>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-amber-500 mt-0.5 text-base sm:text-lg">⟲</span>
                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-sm block">Already used</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">No repeats</span>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="text-red-500 mt-0.5 text-base sm:text-lg">×</span>
                  <div className="min-w-0">
                    <span className="font-bold text-xs sm:text-sm block">Invalid</span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2">Wrong team</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Example */}
            <section>
              <h3 className="text-lg sm:text-xl font-bold text-main dark:text-main-dark mb-0.5 sm:mb-1">
                Example
              </h3>
              <div className="bg-slate-50 dark:bg-neutral-800 rounded-lg border border-slate-200 dark:border-neutral-700 p-2">
                <div className="text-xs text-neutral-500 dark:text-neutral-400">Team: DAL</div>
                <div className="font-mono text-sm">
                  Guess: Tony Romo 
                  <span className="text-emerald-500 ml-1.5">✓</span>
                  <span className="text-neutral-600 dark:text-neutral-400 ml-1.5">78 Wins</span>
                </div>
              </div>
            </section>
          </div>

          {/* Start Button */}
          {isInitialStart && (
            <div className="mt-5">
              <button
                onClick={onClose}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg px-4 py-3 transition-colors"
              >
                Start Playing
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 