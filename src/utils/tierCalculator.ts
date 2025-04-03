export const getTier = (score: number): string => {
  if (score >= 2500) return '🏆 THE GOAT';
  if (score >= 2451) return '🏈 Hall of Famer';
  if (score >= 2401) return '🏆 SuperBowl MVP';
  if (score >= 2351) return '🏈 SuperBowl Winner';
  if (score >= 2301) return '🏆 NFL MVP';
  if (score >= 2251) return '🏆 Heisman Trophy Winner';
  if (score >= 2176) return '🥇 First Round Pick';
  if (score >= 2101) return '🥈 Draft Pick';
  if (score >= 2001) return '🥉 High School All-American';
  if (score >= 1901) return '⭐ Division 1 Scholarship';
  if (score >= 1851) return '⭐ College Walk-on';
  if (score >= 1801) return '⭐ High School Team Captain';
  if (score >= 1751) return '⭐ JV';
  return '⭐ Pop Warner';
}; 