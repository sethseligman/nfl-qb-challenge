// Number of recent teams to track for weighting
const RECENT_TEAMS_TRACKED = 3;
// Weight multiplier for non-recent teams (makes them more likely to be selected)
const NON_RECENT_WEIGHT = 4;

/**
 * Selects a random NFL team with weighted probabilities based on recent history
 * @param recentTeams Array of recently shown teams (most recent first)
 * @param allTeams Array of all available NFL teams
 * @returns Selected team name
 */
export const selectWeightedTeam = (recentTeams: string[], allTeams: string[]): string => {
  // Create weighted pool where non-recent teams appear multiple times
  const weightedPool: string[] = [];
  
  allTeams.forEach(team => {
    // Check if team was shown recently (in last RECENT_TEAMS_TRACKED picks)
    const isRecent = recentTeams
      .slice(0, RECENT_TEAMS_TRACKED)
      .includes(team);
    
    // Add team to pool once if recent, multiple times if not recent
    const weight = isRecent ? 1 : NON_RECENT_WEIGHT;
    for (let i = 0; i < weight; i++) {
      weightedPool.push(team);
    }
  });

  // Select random team from weighted pool
  const randomIndex = Math.floor(Math.random() * weightedPool.length);
  return weightedPool[randomIndex];
};

/**
 * Updates the recent teams array with a new team
 * @param recentTeams Current array of recent teams
 * @param newTeam Team to add to history
 * @returns Updated recent teams array with new team at start
 */
export const updateRecentTeams = (recentTeams: string[], newTeam: string): string[] => {
  return [newTeam, ...recentTeams].slice(0, RECENT_TEAMS_TRACKED);
}; 