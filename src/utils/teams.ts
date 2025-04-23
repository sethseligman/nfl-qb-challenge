import { teamColors } from '../data/teamColors';

/**
 * Returns the appropriate Tailwind CSS border color class for a given team name
 * @param teamName - The name of the NFL team
 * @returns A Tailwind CSS class for border color
 */
export function getTeamColorClass(teamName: string): string {
  const colorClass = teamColors[teamName];
  if (!colorClass) return 'border-neutral-200 dark:border-neutral-700';
  return colorClass.replace('text-', 'border-');
}

/**
 * Returns the path to the team logo image for a given team name
 * @param teamName - The name of the NFL team
 * @returns The path to the team logo image
 */
export function getTeamLogo(teamName: string): string {
  return `/team-logos/${teamName.toLowerCase().replace(/\s+/g, '-')}.png`;
} 