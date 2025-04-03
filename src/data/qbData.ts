interface QBData {
  name: string;
  wins: number;
  teams: string[];
  nicknames?: string[];
}

// Nickname mappings for QBs
const QB_NICKNAMES: Record<string, string> = {
  "TB12": "Tom Brady",
  "The GOAT": "Tom Brady",
  "Peyton": "Peyton Manning",
  "The Sheriff": "Peyton Manning",
  "Favre": "Brett Favre",
  "Brees": "Drew Brees",
  "Big Ben": "Ben Roethlisberger",
  "Elway": "John Elway",
  "Marino": "Dan Marino",
  "Rodgers": "Aaron Rodgers",
  "A-Rod": "Aaron Rodgers",
  "Rivers": "Philip Rivers",
  "Tarkenton": "Fran Tarkenton",
  "Unitas": "Johnny Unitas",
  "Eli": "Eli Manning",
  "Montana": "Joe Montana",
  "Joe Cool": "Joe Montana",
  "Bradshaw": "Terry Bradshaw",
  "Moon": "Warren Moon",
  "Kelly": "Jim Kelly",
  "Wilson": "Russell Wilson",
  "Young": "Steve Young",
  "Aikman": "Troy Aikman",
  "Staubach": "Roger Staubach",
  "Captain America": "Roger Staubach",
  "Mahomes": "Patrick Mahomes",
  "Matty Ice": "Matt Ryan",
  "Bledsoe": "Drew Bledsoe",
  "McNabb": "Donovan McNabb",
  "Palmer": "Carson Palmer",
  "Romo": "Tony Romo",
  "Stafford": "Matthew Stafford",
  "Cousins": "Kirk Cousins",
  "Carr": "Derek Carr",
  "Dak": "Dak Prescott",
  "Lamar": "Lamar Jackson",
  "Allen": "Josh Allen",
  "Burrow": "Joe Burrow",
  "Herbert": "Justin Herbert",
  "Tua": "Tua Tagovailoa",
  "Lawrence": "Trevor Lawrence",
  "Stabler": "Ken Stabler",
  "The Snake": "Ken Stabler",
  "Griese": "Bob Griese",
  "Dawson": "Len Dawson",
  "Starr": "Bart Starr",
  "Jurgensen": "Sonny Jurgensen",
  "Graham": "Otto Graham",
  "Luckman": "Sid Luckman",
  "Baugh": "Sammy Baugh",
  "Layne": "Bobby Layne",
  "Tittle": "Y.A. Tittle",
  "Van Brocklin": "Norm Van Brocklin",
  "Blanda": "George Blanda",
  "Brodie": "John Brodie",
  "Gabriel": "Roman Gabriel",
  "Lamonica": "Daryle Lamonica",
  "The Mad Bomber": "Daryle Lamonica",
  "Kilmer": "Billy Kilmer",
  "Anderson": "Ken Anderson",
  "Hart": "Jim Hart",
  "Archie": "Archie Manning",
  "Fouts": "Dan Fouts",
  "Plunkett": "Jim Plunkett",
  "Jones": "Bert Jones",
  "Sipe": "Brian Sipe",
  "Grogan": "Steve Grogan",
  "Simms": "Phil Simms",
  "McMahon": "Jim McMahon",
  "The Punky QB": "Jim McMahon",
  "Esiason": "Boomer Esiason",
  "Boomer": "Boomer Esiason",
  "Rypien": "Mark Rypien",
  "McNair": "Steve McNair",
  "Air McNair": "Steve McNair",
  "Warner": "Kurt Warner",
  "Gannon": "Rich Gannon",
  "Garcia": "Jeff Garcia",
  "Green": "Trent Green",
  "Plummer": "Jake Plummer",
  "Bulger": "Marc Bulger",
  "Vick": "Michael Vick",
  "Hasselbeck": "Matt Hasselbeck",
  "Luck": "Andrew Luck"
};

// Function to calculate string similarity (Levenshtein distance)
function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix = Array(b.length + 1).fill(null).map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= b.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + cost
      );
    }
  }

  return matrix[b.length][a.length];
}

// Function to find closest match
export function findClosestMatch(input: string, threshold: number = 3): string | null {
  const normalizedInput = input.toLowerCase().trim();
  
  // Check nicknames first (case-insensitive)
  const nicknameMatch = Object.entries(QB_NICKNAMES).find(([nickname]) => 
    nickname.toLowerCase() === normalizedInput
  );
  if (nicknameMatch) return nicknameMatch[1];
  
  // Check exact matches (case-insensitive)
  const exactMatch = Object.keys(qbDatabase).find(name => 
    name.toLowerCase() === normalizedInput
  );
  if (exactMatch) return exactMatch;
  
  // Check for last name matches (case-insensitive)
  const lastNameMatch = Object.entries(qbDatabase).find(([fullName]) => {
    const lastName = fullName.split(' ').pop()?.toLowerCase();
    return lastName === normalizedInput;
  });
  if (lastNameMatch) return lastNameMatch[0];
  
  // Check for close matches using Levenshtein distance
  let closestMatch: string | null = null;
  let minDistance = threshold;
  
  for (const qbName of Object.keys(qbDatabase)) {
    const distance = levenshteinDistance(normalizedInput, qbName.toLowerCase());
    if (distance < minDistance) {
      minDistance = distance;
      closestMatch = qbName;
    }
  }
  
  return closestMatch;
}

export const qbDatabase: Record<string, QBData> = {
  // 200+ Wins
  "Tom Brady": {
    name: "Tom Brady",
    wins: 251,
    teams: ["New England Patriots", "Tampa Bay Buccaneers"]
  },

  // 180-200 Wins
  "Peyton Manning": {
    name: "Peyton Manning",
    wins: 186,
    teams: ["Indianapolis Colts", "Denver Broncos"]
  },
  "Brett Favre": {
    name: "Brett Favre",
    wins: 186,
    teams: ["Green Bay Packers", "New York Jets", "Minnesota Vikings"]
  },

  // 170-180 Wins
  "Drew Brees": {
    name: "Drew Brees",
    wins: 172,
    teams: ["San Diego Chargers", "New Orleans Saints"]
  },

  // 160-170 Wins
  "Ben Roethlisberger": {
    name: "Ben Roethlisberger",
    wins: 165,
    teams: ["Pittsburgh Steelers"]
  },

  // 140-160 Wins
  "John Elway": {
    name: "John Elway",
    wins: 148,
    teams: ["Denver Broncos"]
  },
  "Dan Marino": {
    name: "Dan Marino",
    wins: 147,
    teams: ["Miami Dolphins"]
  },
  "Aaron Rodgers": {
    name: "Aaron Rodgers",
    wins: 147,
    teams: ["Green Bay Packers", "New York Jets"]
  },

  // 130-140 Wins
  "Philip Rivers": {
    name: "Philip Rivers",
    wins: 134,
    teams: ["San Diego Chargers", "Los Angeles Chargers", "Indianapolis Colts"]
  },

  // 120-130 Wins
  "Fran Tarkenton": {
    name: "Fran Tarkenton",
    wins: 124,
    teams: ["Minnesota Vikings", "New York Giants"]
  },
  "Johnny Unitas": {
    name: "Johnny Unitas",
    wins: 118,
    teams: ["Baltimore Colts", "San Diego Chargers"]
  },
  "Eli Manning": {
    name: "Eli Manning",
    wins: 117,
    teams: ["New York Giants"]
  },
  "Joe Montana": {
    name: "Joe Montana",
    wins: 117,
    teams: ["San Francisco 49ers", "Kansas City Chiefs"]
  },

  // 110-120 Wins
  "Terry Bradshaw": {
    name: "Terry Bradshaw",
    wins: 107,
    teams: ["Pittsburgh Steelers"]
  },
  "Warren Moon": {
    name: "Warren Moon",
    wins: 102,
    teams: ["Houston Oilers", "Minnesota Vikings", "Seattle Seahawks", "Kansas City Chiefs"]
  },
  "Jim Kelly": {
    name: "Jim Kelly",
    wins: 101,
    teams: ["Buffalo Bills"]
  },

  // 100-110 Wins
  "Russell Wilson": {
    name: "Russell Wilson",
    wins: 113,
    teams: ["Seattle Seahawks", "Denver Broncos"]
  },
  "Steve Young": {
    name: "Steve Young",
    wins: 94,
    teams: ["San Francisco 49ers"]
  },
  "Troy Aikman": {
    name: "Troy Aikman",
    wins: 94,
    teams: ["Dallas Cowboys"]
  },
  "Roger Staubach": {
    name: "Roger Staubach",
    wins: 85,
    teams: ["Dallas Cowboys"]
  },
  "Patrick Mahomes": {
    name: "Patrick Mahomes",
    wins: 74,
    teams: ["Kansas City Chiefs"]
  },

  // Adding more QBs
  "Matt Ryan": {
    name: "Matt Ryan",
    wins: 124,
    teams: ["Atlanta Falcons", "Indianapolis Colts"]
  },
  "Drew Bledsoe": {
    name: "Drew Bledsoe",
    wins: 98,
    teams: ["New England Patriots", "Buffalo Bills", "Dallas Cowboys"]
  },
  "Donovan McNabb": {
    name: "Donovan McNabb",
    wins: 98,
    teams: ["Philadelphia Eagles", "Washington Commanders", "Minnesota Vikings"]
  },
  "Carson Palmer": {
    name: "Carson Palmer",
    wins: 92,
    teams: ["Cincinnati Bengals", "Oakland Raiders", "Arizona Cardinals"]
  },
  "Tony Romo": {
    name: "Tony Romo",
    wins: 78,
    teams: ["Dallas Cowboys"]
  },
  "Matthew Stafford": {
    name: "Matthew Stafford",
    wins: 89,
    teams: ["Detroit Lions", "Los Angeles Rams"]
  },
  "Kirk Cousins": {
    name: "Kirk Cousins",
    wins: 76,
    teams: ["Washington Commanders", "Minnesota Vikings", "Atlanta Falcons"]
  },
  "Derek Carr": {
    name: "Derek Carr",
    wins: 63,
    teams: ["Oakland Raiders", "Las Vegas Raiders", "New Orleans Saints"]
  },
  "Dak Prescott": {
    name: "Dak Prescott",
    wins: 73,
    teams: ["Dallas Cowboys"]
  },
  "Lamar Jackson": {
    name: "Lamar Jackson",
    wins: 58,
    teams: ["Baltimore Ravens"]
  },
  "Josh Allen": {
    name: "Josh Allen",
    wins: 63,
    teams: ["Buffalo Bills"]
  },
  "Joe Burrow": {
    name: "Joe Burrow",
    wins: 29,
    teams: ["Cincinnati Bengals"]
  },
  "Justin Herbert": {
    name: "Justin Herbert",
    wins: 30,
    teams: ["Los Angeles Chargers"]
  },
  "Tua Tagovailoa": {
    name: "Tua Tagovailoa",
    wins: 32,
    teams: ["Miami Dolphins"]
  },
  "Trevor Lawrence": {
    name: "Trevor Lawrence",
    wins: 20,
    teams: ["Jacksonville Jaguars"]
  },
  "Ken Stabler": {
    name: "Ken Stabler",
    wins: 96,
    teams: ["Oakland Raiders", "Houston Oilers", "New Orleans Saints"]
  },
  "Bob Griese": {
    name: "Bob Griese",
    wins: 92,
    teams: ["Miami Dolphins"]
  },
  "Len Dawson": {
    name: "Len Dawson",
    wins: 94,
    teams: ["Pittsburgh Steelers", "Cleveland Browns", "Kansas City Chiefs"]
  },
  "Bart Starr": {
    name: "Bart Starr",
    wins: 94,
    teams: ["Green Bay Packers"]
  },
  "Sonny Jurgensen": {
    name: "Sonny Jurgensen",
    wins: 69,
    teams: ["Philadelphia Eagles", "Washington Commanders"]
  },

  // Adding more historical QBs
  "Otto Graham": {
    name: "Otto Graham",
    wins: 105,
    teams: ["Cleveland Browns"]
  },
  "Sid Luckman": {
    name: "Sid Luckman",
    wins: 94,
    teams: ["Chicago Bears"]
  },
  "Sammy Baugh": {
    name: "Sammy Baugh",
    wins: 77,
    teams: ["Washington Commanders"]
  },
  "Bobby Layne": {
    name: "Bobby Layne",
    wins: 66,
    teams: ["Chicago Bears", "New York Bulldogs", "Detroit Lions", "Pittsburgh Steelers"]
  },
  "Y.A. Tittle": {
    name: "Y.A. Tittle",
    wins: 68,
    teams: ["Baltimore Colts", "San Francisco 49ers", "New York Giants"]
  },
  "Norm Van Brocklin": {
    name: "Norm Van Brocklin",
    wins: 66,
    teams: ["Los Angeles Rams", "Philadelphia Eagles", "Minnesota Vikings"]
  },
  "George Blanda": {
    name: "George Blanda",
    wins: 83,
    teams: ["Chicago Bears", "Baltimore Colts", "Houston Oilers", "Oakland Raiders"]
  },
  "John Brodie": {
    name: "John Brodie",
    wins: 74,
    teams: ["San Francisco 49ers"]
  },
  "Roman Gabriel": {
    name: "Roman Gabriel",
    wins: 86,
    teams: ["Los Angeles Rams", "Philadelphia Eagles"]
  },
  "Daryle Lamonica": {
    name: "Daryle Lamonica",
    wins: 66,
    teams: ["Buffalo Bills", "Oakland Raiders"]
  },
  "Billy Kilmer": {
    name: "Billy Kilmer",
    wins: 69,
    teams: ["San Francisco 49ers", "New Orleans Saints", "Washington Commanders"]
  },
  "Ken Anderson": {
    name: "Ken Anderson",
    wins: 91,
    teams: ["Cincinnati Bengals"]
  },
  "Jim Hart": {
    name: "Jim Hart",
    wins: 87,
    teams: ["St. Louis Cardinals", "Washington Commanders"]
  },
  "Archie Manning": {
    name: "Archie Manning",
    wins: 35,
    teams: ["New Orleans Saints", "Houston Oilers", "Minnesota Vikings"]
  },
  "Dan Fouts": {
    name: "Dan Fouts",
    wins: 86,
    teams: ["San Diego Chargers"]
  },
  "Jim Plunkett": {
    name: "Jim Plunkett",
    wins: 72,
    teams: ["New England Patriots", "San Francisco 49ers", "Oakland Raiders", "Los Angeles Raiders"]
  },
  "Bert Jones": {
    name: "Bert Jones",
    wins: 46,
    teams: ["Baltimore Colts", "Los Angeles Rams"]
  },
  "Brian Sipe": {
    name: "Brian Sipe",
    wins: 57,
    teams: ["Cleveland Browns"]
  },
  "Steve Grogan": {
    name: "Steve Grogan",
    wins: 75,
    teams: ["New England Patriots"]
  },

  // Adding final group of QBs
  "Phil Simms": {
    name: "Phil Simms",
    wins: 95,
    teams: ["New York Giants"]
  },
  "Jim McMahon": {
    name: "Jim McMahon",
    wins: 67,
    teams: ["Chicago Bears", "San Diego Chargers", "Philadelphia Eagles", "Minnesota Vikings", "Arizona Cardinals", "Green Bay Packers"]
  },
  "Boomer Esiason": {
    name: "Boomer Esiason",
    wins: 80,
    teams: ["Cincinnati Bengals", "New York Jets", "Arizona Cardinals"]
  },
  "Mark Rypien": {
    name: "Mark Rypien",
    wins: 45,
    teams: ["Washington Commanders", "Cleveland Browns", "St. Louis Rams", "Philadelphia Eagles", "Indianapolis Colts"]
  },
  "Steve McNair": {
    name: "Steve McNair",
    wins: 91,
    teams: ["Houston Oilers", "Tennessee Titans", "Baltimore Ravens"]
  },
  "Kurt Warner": {
    name: "Kurt Warner",
    wins: 67,
    teams: ["St. Louis Rams", "New York Giants", "Arizona Cardinals"]
  },
  "Rich Gannon": {
    name: "Rich Gannon",
    wins: 76,
    teams: ["Minnesota Vikings", "Washington Commanders", "Kansas City Chiefs", "Oakland Raiders"]
  },
  "Jeff Garcia": {
    name: "Jeff Garcia",
    wins: 58,
    teams: ["San Francisco 49ers", "Cleveland Browns", "Detroit Lions", "Philadelphia Eagles", "Tampa Bay Buccaneers"]
  },
  "Trent Green": {
    name: "Trent Green",
    wins: 56,
    teams: ["Washington Commanders", "St. Louis Rams", "Kansas City Chiefs", "Miami Dolphins"]
  },
  "Jake Plummer": {
    name: "Jake Plummer",
    wins: 69,
    teams: ["Arizona Cardinals", "Denver Broncos"]
  },
  "Marc Bulger": {
    name: "Marc Bulger",
    wins: 42,
    teams: ["St. Louis Rams"]
  },
  "Michael Vick": {
    name: "Michael Vick",
    wins: 61,
    teams: ["Atlanta Falcons", "Philadelphia Eagles", "New York Jets", "Pittsburgh Steelers"]
  },
  "Matt Hasselbeck": {
    name: "Matt Hasselbeck",
    wins: 85,
    teams: ["Green Bay Packers", "Seattle Seahawks", "Tennessee Titans", "Indianapolis Colts"]
  },
  "Andrew Luck": {
    name: "Andrew Luck",
    wins: 53,
    teams: ["Indianapolis Colts"]
  }
};

export function validateQB(qbName: string, team: string): QBData | null {
  // Try to find the closest match for the QB name
  const matchedName = findClosestMatch(qbName);
  if (!matchedName) return null;
  
  const qb = qbDatabase[matchedName];
  if (!qb) return null;
  
  // Special case for Baltimore Colts/Indianapolis Colts
  if (team === "Indianapolis Colts" && qb.teams.includes("Baltimore Colts")) {
    return qb;
  }
  
  if (!qb.teams.includes(team)) return null;
  
  return qb;
}

// Function to format QB display name
export function formatQBDisplayName(input: string, fullName: string): string {
  // If input is a recognized nickname, show "Full Name / 'Nickname'"
  if (QB_NICKNAMES[input.toLowerCase()]) {
    return `${fullName} / '${input}'`;
  }
  
  // If input is a last name, just show the full name
  const lastNames = Object.entries(qbDatabase).reduce((acc, [fullName]) => {
    const lastName = fullName.split(' ').pop()?.toLowerCase();
    if (lastName) {
      acc[lastName] = fullName;
    }
    return acc;
  }, {} as Record<string, string>);

  if (lastNames[input.toLowerCase()]) {
    return fullName;
  }

  // For exact matches, show full name only
  return fullName;
}

export function findHighestScoringQB(team: string | null, usedQBs: string[]): QBData | null {
  if (!team) return null;
  
  let highestQB: QBData | null = null;
  let highestWins = -1;

  for (const [name, data] of Object.entries(qbDatabase)) {
    if (data.teams.includes(team) && !usedQBs.includes(name)) {
      if (data.wins > highestWins) {
        highestWins = data.wins;
        highestQB = data;
      }
    }
  }

  return highestQB;
} 