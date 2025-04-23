export interface QBData {
  name: string;
  wins: number;
  teams: string[];
  nicknames?: string[];
  ties?: number;
}

// Nickname mappings for QBs
const QB_NICKNAMES: Record<string, string> = {
  "TB12": "Tom Brady",
  "The GOAT": "Tom Brady",
  "Peyton": "Peyton Manning",
  "The Sheriff": "Peyton Manning",
  "Big Ben": "Ben Roethlisberger",
  "A-Rod": "Aaron Rodgers",
  "Joe Cool": "Joe Montana",
  "Captain America": "Roger Staubach",
  "Matty Ice": "Matt Ryan",
  "Dak": "Dak Prescott",
  "Tua": "Tua Tagovailoa",
  "The Snake": "Ken Stabler",
  "The Mad Bomber": "Daryle Lamonica",
  "The Punky QB": "Jim McMahon",
  "Air McNair": "Steve McNair",
  "Fitz": "Ryan Fitzpatrick",
  "Fitzmagic": "Ryan Fitzpatrick",
  "Tyrod": "Tyrod Taylor",
  "Boomer": "Boomer Esiason",
  "Eli": "Eli Manning"
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
    wins: 153,
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
    teams: ["Seattle Seahawks", "Houston Oilers", "Minnesota Vikings", "Kansas City Chiefs"]
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
    wins: 89,
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
    wins: 108,
    teams: ["Detroit Lions", "Los Angeles Rams"]
  },
  "Kirk Cousins": {
    name: "Kirk Cousins",
    wins: 78,
    teams: ["Washington Commanders", "Minnesota Vikings"]
  },
  "Derek Carr": {
    name: "Derek Carr",
    wins: 77,
    teams: ["New Orleans Saints", "Oakland Raiders", "Las Vegas Raiders"]
  },
  "Dak Prescott": {
    name: "Dak Prescott",
    wins: 76,
    teams: ["Dallas Cowboys"]
  },
  "Lamar Jackson": {
    name: "Lamar Jackson",
    wins: 70,
    teams: ["Baltimore Ravens"]
  },
  "Josh Allen": {
    name: "Josh Allen",
    wins: 76,
    teams: ["Buffalo Bills"]
  },
  "Joe Burrow": {
    name: "Joe Burrow",
    wins: 38,
    teams: ["Cincinnati Bengals"]
  },
  "Justin Herbert": {
    name: "Justin Herbert",
    wins: 41,
    teams: ["Los Angeles Chargers"]
  },
  "Tua Tagovailoa": {
    name: "Tua Tagovailoa",
    wins: 40,
    teams: ["Miami Dolphins"]
  },
  "Trevor Lawrence": {
    name: "Trevor Lawrence",
    wins: 22,
    teams: ["Jacksonville Jaguars"]
  },
  "Mark Brunell": {
    name: "Mark Brunell",
    wins: 69,
    teams: ["Jacksonville Jaguars", "Washington Commanders", "New Orleans Saints", "New York Jets"]
  },
  "David Garrard": {
    name: "David Garrard",
    wins: 39,
    teams: ["Jacksonville Jaguars", "New York Jets"]
  },
  "Blake Bortles": {
    name: "Blake Bortles",
    wins: 24,
    teams: ["Jacksonville Jaguars", "Los Angeles Rams", "Denver Broncos", "Green Bay Packers", "New Orleans Saints"]
  },
  "Nick Foles": {
    name: "Nick Foles",
    wins: 29,
    teams: ["Jacksonville Jaguars", "Philadelphia Eagles", "St. Louis Rams", "Kansas City Chiefs", "Chicago Bears", "Indianapolis Colts"]
  },
  "Gardner Minshew": {
    name: "Gardner Minshew",
    wins: 7,
    teams: ["Jacksonville Jaguars", "Philadelphia Eagles", "Indianapolis Colts"]
  },
  "Byron Leftwich": {
    name: "Byron Leftwich",
    wins: 24,
    teams: ["Pittsburgh Steelers", "Jacksonville Jaguars", "Atlanta Falcons", "Tampa Bay Buccaneers"]
  },
  "Chad Henne": {
    name: "Chad Henne",
    wins: 18,
    teams: ["Jacksonville Jaguars", "Miami Dolphins", "Kansas City Chiefs"]
  },
  "C.J. Beathard": {
    name: "C.J. Beathard",
    wins: 2,
    teams: ["Jacksonville Jaguars", "San Francisco 49ers"]
  },
  "Mike Glennon": {
    name: "Mike Glennon",
    wins: 6,
    teams: ["Jacksonville Jaguars", "Tampa Bay Buccaneers", "Chicago Bears", "Arizona Cardinals", "New York Giants", "Miami Dolphins"]
  },
  "Jake Luton": {
    name: "Jake Luton",
    wins: 0,
    teams: ["Seattle Seahawks", "Jacksonville Jaguars", "Miami Dolphins", "Minnesota Vikings"]
  },
  "Josh Johnson": {
    name: "Josh Johnson",
    wins: 1,
    teams: ["Jacksonville Jaguars", "Tampa Bay Buccaneers", "San Francisco 49ers", "Cleveland Browns", "Cincinnati Bengals", "New York Jets", "Washington Commanders", "Baltimore Ravens", "Denver Broncos", "Houston Texans", "Las Vegas Raiders", "Dallas Cowboys"]
  },
  "Nathan Rourke": {
    name: "Nathan Rourke",
    wins: 0,
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
    wins: 78,
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
  "Joe Flacco": {
    name: "Joe Flacco",
    wins: 98,
    teams: ["Baltimore Ravens", "Denver Broncos", "New York Jets", "Cleveland Browns", "Indianapolis Colts"]
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
    teams: ["Tennessee Titans", "Houston Oilers", "Baltimore Ravens"]
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
    teams: ["Kansas City Chiefs", "Washington Commanders", "St. Louis Rams", "Miami Dolphins"]
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
    teams: ["Pittsburgh Steelers", "Atlanta Falcons", "Philadelphia Eagles", "New York Jets"]
  },
  "Matt Hasselbeck": {
    name: "Matt Hasselbeck",
    wins: 85,
    teams: ["Tennessee Titans", "Seattle Seahawks", "Green Bay Packers", "Indianapolis Colts"]
  },
  "Andrew Luck": {
    name: "Andrew Luck",
    wins: 53,
    teams: ["Indianapolis Colts"]
  },
  "Vinny Testaverde": {
    name: "Vinny Testaverde",
    wins: 90,
    teams: ["Tampa Bay Buccaneers", "Cleveland Browns", "Baltimore Ravens", "New York Jets", "Dallas Cowboys", "New England Patriots", "Carolina Panthers"]
  },

  // Houston Texans QBs
  "Deshaun Watson": {
    name: "Deshaun Watson",
    wins: 28,
    teams: ["Houston Texans", "Cleveland Browns"]
  },
  "Matt Schaub": {
    name: "Matt Schaub",
    wins: 46,
    teams: ["Houston Texans", "Atlanta Falcons", "Oakland Raiders", "Baltimore Ravens"]
  },
  "David Carr": {
    name: "David Carr",
    wins: 23,
    teams: ["Houston Texans", "Carolina Panthers", "New York Giants", "San Francisco 49ers"]
  },
  "Case Keenum": {
    name: "Case Keenum",
    wins: 29,
    teams: ["Houston Texans", "Minnesota Vikings", "Denver Broncos", "Washington Commanders", "Cleveland Browns", "Buffalo Bills", "Los Angeles Rams"]
  },
  "Ryan Fitzpatrick": {
    name: "Ryan Fitzpatrick",
    wins: 59,
    teams: ["Tennessee Titans", "Buffalo Bills", "Houston Texans", "New York Jets", "Tampa Bay Buccaneers", "Miami Dolphins", "Washington Commanders"]
  },
  "Brian Hoyer": {
    name: "Brian Hoyer",
    wins: 16,
    teams: ["Houston Texans", "New England Patriots", "Arizona Cardinals", "Cleveland Browns", "Chicago Bears", "San Francisco 49ers", "Indianapolis Colts", "Las Vegas Raiders"]
  },
  "T.J. Yates": {
    name: "T.J. Yates",
    wins: 4,
    teams: ["Houston Texans", "Atlanta Falcons", "Miami Dolphins"]
  },
  "Brandon Weeden": {
    name: "Brandon Weeden",
    wins: 5,
    teams: ["Houston Texans", "Cleveland Browns", "Dallas Cowboys", "Tennessee Titans"]
  },
  "Ryan Mallett": {
    name: "Ryan Mallett",
    wins: 3,
    teams: ["Houston Texans", "Baltimore Ravens"]
  },
  "Tom Savage": {
    name: "Tom Savage",
    wins: 2,
    teams: ["Houston Texans", "San Francisco 49ers"]
  },
  "Davis Mills": {
    name: "Davis Mills",
    wins: 5,
    teams: ["Houston Texans"]
  },
  "Tyrod Taylor": {
    name: "Tyrod Taylor",
    wins: 24,
    teams: ["Houston Texans", "Buffalo Bills", "Cleveland Browns", "Los Angeles Chargers", "New York Giants"]
  },
  "Jeff Driskel": {
    name: "Jeff Driskel",
    wins: 1,
    teams: ["Houston Texans", "Cincinnati Bengals", "Detroit Lions", "Denver Broncos", "San Francisco 49ers"]
  },
  "Kyle Allen": {
    name: "Kyle Allen",
    wins: 2,
    teams: ["Houston Texans", "Carolina Panthers", "Washington Commanders", "Buffalo Bills"]
  },
  "Scott Hunter": {
    name: "Scott Hunter",
    wins: 6,
    teams: ["Green Bay Packers", "Buffalo Bills", "Atlanta Falcons", "Detroit Lions", "Cincinnati Bengals"]
  },
  "Jordan Love": {
    name: "Jordan Love",
    wins: 21,
    teams: ["Green Bay Packers"]
  },
  "Don Horn": {
    name: "Don Horn",
    wins: 4,
    teams: ["Green Bay Packers", "Denver Broncos", "San Diego Chargers", "Cleveland Browns"]
  },
  "Zeke Bratkowski": {
    name: "Zeke Bratkowski",
    wins: 12,
    teams: ["Green Bay Packers", "Chicago Bears", "Los Angeles Rams"]
  },
  "John Hadl": {
    name: "John Hadl",
    wins: 82,
    teams: ["Green Bay Packers", "San Diego Chargers", "Los Angeles Rams", "Houston Oilers"]
  },
  "David Whitehurst": {
    name: "David Whitehurst",
    wins: 17,
    teams: ["Green Bay Packers", "Kansas City Chiefs"]
  },
  "Lynn Dickey": {
    name: "Lynn Dickey",
    wins: 25,
    teams: ["Green Bay Packers", "Houston Oilers", "Kansas City Chiefs"]
  },
  "Randy Wright": {
    name: "Randy Wright",
    wins: 4,
    teams: ["Green Bay Packers"]
  },
  "Anthony Dilweg": {
    name: "Anthony Dilweg",
    wins: 2,
    teams: ["Green Bay Packers"]
  },
  "Mike Tomczak": {
    name: "Mike Tomczak",
    wins: 42,
    teams: ["Pittsburgh Steelers", "Chicago Bears", "Green Bay Packers", "Cleveland Browns", "Washington Commanders"]
  },
  "Blair Kiel": {
    name: "Blair Kiel",
    wins: 0,
    teams: ["Green Bay Packers", "Indianapolis Colts", "Tampa Bay Buccaneers"]
  },
  "Don Majkowski": {
    name: "Don Majkowski",
    wins: 27,
    teams: ["Green Bay Packers", "Indianapolis Colts", "Detroit Lions"]
  },
  "Ty Detmer": {
    name: "Ty Detmer",
    wins: 4,
    teams: ["Green Bay Packers", "Philadelphia Eagles", "San Francisco 49ers", "Cleveland Browns", "Detroit Lions", "Atlanta Falcons"]
  },
  "Doug Pederson": {
    name: "Doug Pederson",
    wins: 2,
    teams: ["Green Bay Packers", "Philadelphia Eagles", "Cleveland Browns", "Miami Dolphins"]
  },
  "Matt Flynn": {
    name: "Matt Flynn",
    wins: 3,
    teams: ["Green Bay Packers", "Seattle Seahawks", "Oakland Raiders", "Buffalo Bills", "New York Jets", "New Orleans Saints"]
  },
  "Brett Hundley": {
    name: "Brett Hundley",
    wins: 3,
    teams: ["Green Bay Packers", "Seattle Seahawks", "Arizona Cardinals", "Indianapolis Colts"]
  },
  "Tim Boyle": {
    name: "Tim Boyle",
    wins: 0,
    teams: ["Green Bay Packers", "Detroit Lions", "New York Jets"]
  },
  "Elvis Grbac": {
    name: "Elvis Grbac",
    wins: 31,
    teams: ["Kansas City Chiefs", "San Francisco 49ers", "Baltimore Ravens"]
  },
  "Damon Huard": {
    name: "Damon Huard",
    wins: 14,
    teams: ["Kansas City Chiefs", "Miami Dolphins", "New England Patriots", "San Francisco 49ers"]
  },
  "Brodie Croyle": {
    name: "Brodie Croyle",
    wins: 0,
    teams: ["Kansas City Chiefs"]
  },
  "Kerry Collins": {
    name: "Kerry Collins",
    wins: 81,
    teams: ["Tennessee Titans", "Carolina Panthers", "New York Giants", "Oakland Raiders", "Indianapolis Colts"]
  },
  "Jake Locker": {
    name: "Jake Locker",
    wins: 9,
    teams: ["Tennessee Titans"]
  },
  "Marcus Mariota": {
    name: "Marcus Mariota",
    wins: 29,
    teams: ["Tennessee Titans", "Las Vegas Raiders", "Atlanta Falcons", "Philadelphia Eagles"]
  },
  "Matt Cassel": {
    name: "Matt Cassel",
    wins: 33,
    teams: ["Tennessee Titans", "New England Patriots", "Kansas City Chiefs", "Minnesota Vikings", "Buffalo Bills", "Dallas Cowboys", "Detroit Lions"]
  },
  "Blaine Gabbert": {
    name: "Blaine Gabbert",
    wins: 13,
    teams: ["Tennessee Titans", "Jacksonville Jaguars", "San Francisco 49ers", "Arizona Cardinals", "Kansas City Chiefs", "Tampa Bay Buccaneers"]
  },
  "Rusty Smith": {
    name: "Rusty Smith",
    wins: 0,
    teams: ["Tennessee Titans"]
  },
  "Alex Hasselbeck": {
    name: "Alex Hasselbeck",
    wins: 0,
    teams: ["Tennessee Titans"]
  },
  "Jay Cutler": {
    name: "Jay Cutler",
    wins: 74,
    teams: ["Denver Broncos", "Chicago Bears", "Miami Dolphins"]
  },
  "Joe Theismann": {
    name: "Joe Theismann",
    wins: 77,
    teams: ["Washington Commanders"]
  },
  "Cam Newton": {
    name: "Cam Newton",
    wins: 75,
    teams: ["Carolina Panthers", "New England Patriots", "Carolina Panthers"]
  },
  "Alex Smith": {
    name: "Alex Smith",
    wins: 99,
    teams: ["San Francisco 49ers", "Kansas City Chiefs", "Washington Commanders"]
  },
  "Dave Krieg": {
    name: "Dave Krieg",
    wins: 98,
    teams: ["Seattle Seahawks", "Kansas City Chiefs", "Detroit Lions", "Arizona Cardinals", "Tennessee Titans", "Chicago Bears"]
  },
  "Andy Dalton": {
    name: "Andy Dalton",
    wins: 84,
    teams: ["Cincinnati Bengals", "Dallas Cowboys", "Chicago Bears", "Buffalo Bills", "Carolina Panthers"]
  },
  "Randall Cunningham": {
    name: "Randall Cunningham",
    wins: 82,
    teams: ["Philadelphia Eagles", "Minnesota Vikings", "Dallas Cowboys", "Baltimore Ravens"]
  },
  "Jared Goff": {
    name: "Jared Goff",
    wins: 81,
    teams: ["Los Angeles Rams", "Detroit Lions"]
  },
  "Craig Morton": {
    name: "Craig Morton",
    wins: 81,
    teams: ["Dallas Cowboys", "New York Giants", "Denver Broncos", "Oakland Raiders"]
  },
  "Ryan Tannehill": {
    name: "Ryan Tannehill",
    wins: 81,
    teams: ["Miami Dolphins", "Tennessee Titans"]
  },
  "Joe Ferguson": {
    name: "Joe Ferguson",
    wins: 79,
    teams: ["Buffalo Bills", "Detroit Lions", "Tampa Bay Buccaneers"]
  },
  "Ron Jaworski": {
    name: "Ron Jaworski",
    wins: 73,
    teams: ["Philadelphia Eagles", "Miami Dolphins", "Kansas City Chiefs"]
  },
  "Brad Johnson": {
    name: "Brad Johnson",
    wins: 72,
    teams: ["Minnesota Vikings", "Tampa Bay Buccaneers", "Dallas Cowboys"]
  },
  "Chris Chandler": {
    name: "Chris Chandler",
    wins: 67,
    teams: ["Indianapolis Colts", "Tampa Bay Buccaneers", "Houston Oilers", "Atlanta Falcons", "Chicago Bears", "St. Louis Rams", "Tennessee Titans"]
  },
  "Jim Harbaugh": {
    name: "Jim Harbaugh",
    wins: 66,
    teams: ["Chicago Bears", "Indianapolis Colts", "Baltimore Ravens", "San Diego Chargers", "Detroit Lions", "Carolina Panthers"]
  },
  "Charlie Conerly": {
    name: "Charlie Conerly",
    wins: 65,
    teams: ["New York Giants"]
  },
  "Jack Kemp": {
    name: "Jack Kemp",
    wins: 64,
    teams: ["Buffalo Bills", "San Diego Chargers", "Detroit Lions"]
  },
  "Jim Everett": {
    name: "Jim Everett",
    wins: 63,
    teams: ["Los Angeles Rams", "New Orleans Saints", "San Diego Chargers"]
  },
  "Earl Morrall": {
    name: "Earl Morrall",
    wins: 63,
    teams: ["San Francisco 49ers", "Pittsburgh Steelers", "Detroit Lions", "Baltimore Colts", "Miami Dolphins", "Baltimore Ravens"]
  },
  "Jake Delhomme": {
    name: "Jake Delhomme",
    wins: 56,
    teams: ["Carolina Panthers", "Cleveland Browns", "Houston Texans"]
  },
  "Bobby Hebert": {
    name: "Bobby Hebert",
    wins: 56,
    teams: ["New Orleans Saints", "Atlanta Falcons"]
  },
  "Dan Pastorini": {
    name: "Dan Pastorini",
    wins: 56,
    teams: ["Houston Oilers", "Oakland Raiders", "Los Angeles Rams", "Philadelphia Eagles"]
  },
  "Milt Plum": {
    name: "Milt Plum",
    wins: 56,
    teams: ["Cleveland Browns", "Detroit Lions", "New York Giants", "Baltimore Colts"]
  },
  "Neil O'Donnell": {
    name: "Neil O'Donnell",
    wins: 55,
    teams: ["Pittsburgh Steelers", "New York Jets", "Tennessee Titans", "Cincinnati Bengals"]
  },
  "Joe Namath": {
    name: "Joe Namath",
    wins: 62,
    teams: ["New York Jets", "Los Angeles Rams"],
    ties: 4
  },
  "Danny White": {
    name: "Danny White",
    wins: 53,
    teams: ["Dallas Cowboys"]
  },
  "Jay Schroeder": {
    name: "Jay Schroeder",
    wins: 51,
    teams: ["Washington Commanders", "Los Angeles Raiders", "Cincinnati Bengals", "Arizona Cardinals"]
  },
  "Steve Bartkowski": {
    name: "Steve Bartkowski",
    wins: 50,
    teams: ["Atlanta Falcons", "Los Angeles Rams"]
  },
  "Charley Johnson": {
    name: "Charley Johnson",
    wins: 50,
    teams: ["St. Louis Cardinals", "Houston Oilers", "Denver Broncos", "San Diego Chargers"]
  },
  "Trent Dilfer": {
    name: "Trent Dilfer",
    wins: 50,
    teams: ["Tampa Bay Buccaneers", "Baltimore Ravens", "Seattle Seahawks", "Cleveland Browns", "San Francisco 49ers"]
  },
  "Frank Ryan": {
    name: "Frank Ryan",
    wins: 56,
    teams: ["Los Angeles Rams", "Cleveland Browns", "Washington Commanders"]
  },
  "Tommy Kramer": {
    name: "Tommy Kramer",
    wins: 54,
    teams: ["Minnesota Vikings", "New Orleans Saints"]
  },

  // Adding CJ Stroud and Baker Mayfield
  "C.J. Stroud": {
    name: "C.J. Stroud",
    wins: 19,
    teams: ["Houston Texans"]
  },
  "Baker Mayfield": {
    name: "Baker Mayfield",
    wins: 50,
    teams: ["Cleveland Browns", "Carolina Panthers", "Los Angeles Rams", "Tampa Bay Buccaneers"]
  },

  // Adding verified QBs
  "Brandon Allen": {
    name: "Brandon Allen",
    wins: 2,
    teams: ["Denver Broncos", "Cincinnati Bengals", "Tennessee Titans"]
  },
  "Tyson Bagent": {
    name: "Tyson Bagent",
    wins: 2,
    teams: ["Chicago Bears"]
  },
  "Stetson Bennett": {
    name: "Stetson Bennett",
    wins: 0,
    teams: ["Los Angeles Rams"]
  },
  "Jacoby Brissett": {
    name: "Jacoby Brissett",
    wins: 19,
    teams: ["New England Patriots", "Indianapolis Colts", "Miami Dolphins", "Cleveland Browns", "Washington Commanders", "Arizona Cardinals"]
  },
  "Jake Browning": {
    name: "Jake Browning",
    wins: 4,
    teams: ["Cincinnati Bengals"]
  },
  "Shane Buechele": {
    name: "Shane Buechele",
    wins: 0,
    teams: ["Kansas City Chiefs", "Buffalo Bills"]
  },
  "Sean Clifford": {
    name: "Sean Clifford",
    wins: 0,
    teams: ["Green Bay Packers"]
  },
  "Sam Darnold": {
    name: "Sam Darnold",
    wins: 35,
    teams: ["New York Jets", "Carolina Panthers", "San Francisco 49ers", "Minnesota Vikings", "Seattle Seahawks"]
  },
  "Tommy DeVito": {
    name: "Tommy DeVito",
    wins: 3,
    teams: ["New York Giants"]
  },
  "Ben DiNucci": {
    name: "Ben DiNucci",
    wins: 0,
    teams: ["Dallas Cowboys", "Denver Broncos", "New Orleans Saints"]
  },
  "Joshua Dobbs": {
    name: "Joshua Dobbs",
    wins: 3,
    teams: ["Pittsburgh Steelers", "Jacksonville Jaguars", "Cleveland Browns", "Tennessee Titans", "Arizona Cardinals", "Minnesota Vikings", "New England Patriots"]
  },
  "Sam Ehlinger": {
    name: "Sam Ehlinger",
    wins: 0,
    teams: ["Indianapolis Colts", "Denver Broncos"]
  },
  "Jayden Daniels": {
    name: "Jayden Daniels",
    wins: 12,
    teams: ["Washington Commanders"]
  },
  
  // Adding next set of verified QBs
  "Justin Fields": {
    name: "Justin Fields",
    wins: 14,
    teams: ["Chicago Bears", "New York Jets"]
  },
  "Jake Fromm": {
    name: "Jake Fromm",
    wins: 0,
    teams: ["Buffalo Bills", "New York Giants", "Washington Commanders", "Detroit Lions"]
  },
  "Jimmy Garoppolo": {
    name: "Jimmy Garoppolo",
    wins: 43,
    teams: ["New England Patriots", "San Francisco 49ers", "Las Vegas Raiders", "Los Angeles Rams"]
  },
  "Will Grier": {
    name: "Will Grier",
    wins: 0,
    teams: ["Carolina Panthers", "Dallas Cowboys", "New England Patriots"]
  },
  "Jake Haener": {
    name: "Jake Haener",
    wins: 0,
    teams: ["New Orleans Saints"]
  },
  "Jaren Hall": {
    name: "Jaren Hall",
    wins: 0,
    teams: ["Minnesota Vikings", "Seattle Seahawks"]
  },
  "Sam Hartman": {
    name: "Sam Hartman",
    wins: 0,
    teams: ["Washington Commanders"]
  },
  "Taylor Heinicke": {
    name: "Taylor Heinicke",
    wins: 13,
    teams: ["Minnesota Vikings", "Carolina Panthers", "Washington Commanders", "Atlanta Falcons", "Los Angeles Chargers"]
  },
  "Hendon Hooker": {
    name: "Hendon Hooker",
    wins: 0,
    teams: ["Detroit Lions"]
  },
  "Sam Howell": {
    name: "Sam Howell",
    wins: 4,
    teams: ["Washington Commanders", "Seattle Seahawks"]
  },
  "Jalen Hurts": {
    name: "Jalen Hurts",
    wins: 46,
    teams: ["Philadelphia Eagles"]
  },
  "Daniel Jones": {
    name: "Daniel Jones",
    wins: 24,
    teams: ["New York Giants", "Indianapolis Colts"]
  },
  "Emory Jones": {
    name: "Emory Jones",
    wins: 0,
    teams: ["Atlanta Falcons"]
  },
  "Mac Jones": {
    name: "Mac Jones",
    wins: 20,
    teams: ["New England Patriots", "San Francisco 49ers"]
  },
  "Trey Lance": {
    name: "Trey Lance",
    wins: 2,
    teams: ["San Francisco 49ers", "Dallas Cowboys", "Los Angeles Chargers"]
  },
  
  // Adding next set of verified QBs
  "Devin Leary": {
    name: "Devin Leary",
    wins: 0,
    teams: ["Baltimore Ravens"]
  },
  "Will Levis": {
    name: "Will Levis",
    wins: 5,
    teams: ["Tennessee Titans"]
  },
  "Drew Lock": {
    name: "Drew Lock",
    wins: 10,
    teams: ["Denver Broncos", "Seattle Seahawks"]
  },
  "Adrian Martinez": {
    name: "Adrian Martinez",
    wins: 0,
    teams: ["New York Jets"]
  },
  "Drake Maye": {
    name: "Drake Maye",
    wins: 3,
    teams: ["New England Patriots"]
  },
  "J.J. McCarthy": {
    name: "J.J. McCarthy",
    wins: 0,
    teams: ["Minnesota Vikings"]
  },
  "Tanner McKee": {
    name: "Tanner McKee",
    wins: 0,
    teams: ["Philadelphia Eagles"]
  },
  "Joe Milton III": {
    name: "Joe Milton III",
    wins: 0,
    teams: ["Dallas Cowboys"]
  },
  "Tanner Mordecai": {
    name: "Tanner Mordecai",
    wins: 0,
    teams: ["San Francisco 49ers"]
  },
  "Nick Mullens": {
    name: "Nick Mullens",
    wins: 5,
    teams: ["San Francisco 49ers", "Cleveland Browns", "Minnesota Vikings", "Jacksonville Jaguars"]
  },
  "Kyler Murray": {
    name: "Kyler Murray",
    wins: 36,
    teams: ["Arizona Cardinals"]
  },
  "Bo Nix": {
    name: "Bo Nix",
    wins: 10,
    teams: ["Denver Broncos"]
  },
  "Aidan O'Connell": {
    name: "Aidan O'Connell",
    wins: 3,
    teams: ["Las Vegas Raiders"]
  },
  "Chris Oladokun": {
    name: "Chris Oladokun",
    wins: 0,
    teams: ["Pittsburgh Steelers", "Kansas City Chiefs"]
  },
  "Michael Penix Jr.": {
    name: "Michael Penix Jr.",
    wins: 0,
    teams: ["Atlanta Falcons"]
  },
  
  // Adding next set of verified QBs
  "Kenny Pickett": {
    name: "Kenny Pickett",
    wins: 15,
    teams: ["Pittsburgh Steelers", "Cleveland Browns"]
  },
  "Jack Plummer": {
    name: "Jack Plummer",
    wins: 0,
    teams: ["Carolina Panthers"]
  },
  "Michael Pratt": {
    name: "Michael Pratt",
    wins: 0,
    teams: ["Tampa Bay Buccaneers"]
  },
  "Brock Purdy": {
    name: "Brock Purdy",
    wins: 23,
    teams: ["San Francisco 49ers"]
  },
  "Spencer Rattler": {
    name: "Spencer Rattler",
    wins: 0,
    teams: ["New Orleans Saints"]
  },
  "Austin Reed": {
    name: "Austin Reed",
    wins: 0,
    teams: ["Chicago Bears"]
  },
  "Anthony Richardson": {
    name: "Anthony Richardson",
    wins: 8,
    teams: ["Indianapolis Colts"]
  },
  "Mason Rudolph": {
    name: "Mason Rudolph",
    wins: 8,
    teams: ["Pittsburgh Steelers"]
  },
  "Cooper Rush": {
    name: "Cooper Rush",
    wins: 9,
    teams: ["Dallas Cowboys", "Baltimore Ravens"]
  },
  "Brett Rypien": {
    name: "Brett Rypien",
    wins: 2,
    teams: ["Denver Broncos", "Los Angeles Rams", "Seattle Seahawks", "Minnesota Vikings"]
  },
  "Kedon Slovis": {
    name: "Kedon Slovis",
    wins: 0,
    teams: ["Houston Texans"]
  },
  "Geno Smith": {
    name: "Geno Smith",
    wins: 40,
    teams: ["New York Jets", "New York Giants", "Los Angeles Chargers", "Seattle Seahawks", "Las Vegas Raiders"]
  },
  "Jarrett Stidham": {
    name: "Jarrett Stidham",
    wins: 0,
    teams: ["New England Patriots", "Las Vegas Raiders", "Denver Broncos"]
  },
  "Skylar Thompson": {
    name: "Skylar Thompson",
    wins: 1,
    teams: ["Miami Dolphins", "Pittsburgh Steelers"]
  },
  "Dorian Thompson-Robinson": {
    name: "Dorian Thompson-Robinson",
    wins: 1,
    teams: ["Cleveland Browns", "Philadelphia Eagles"]
  },
  
  // Adding final set of verified QBs
  "Kyle Trask": {
    name: "Kyle Trask",
    wins: 0,
    teams: ["Tampa Bay Buccaneers"]
  },
  "Jordan Travis": {
    name: "Jordan Travis",
    wins: 0,
    teams: ["New York Jets"]
  },
  "Mitchell Trubisky": {
    name: "Mitchell Trubisky",
    wins: 31,
    teams: ["Chicago Bears", "Buffalo Bills", "Pittsburgh Steelers", "Buffalo Bills"]
  },
  "Clayton Tune": {
    name: "Clayton Tune",
    wins: 0,
    teams: ["Arizona Cardinals"]
  },
  "Mike White": {
    name: "Mike White",
    wins: 2,
    teams: ["New York Jets", "Miami Dolphins", "Buffalo Bills"]
  },
  "Caleb Williams": {
    name: "Caleb Williams",
    wins: 5,
    teams: ["Chicago Bears"]
  },
  "Malik Willis": {
    name: "Malik Willis",
    wins: 3,
    teams: ["Tennessee Titans", "Green Bay Packers"]
  },
  "Zach Wilson": {
    name: "Zach Wilson",
    wins: 12,
    teams: ["New York Jets", "Miami Dolphins"]
  },
  "Jameis Winston": {
    name: "Jameis Winston",
    wins: 36,
    teams: ["Tampa Bay Buccaneers", "New Orleans Saints", "New York Giants"]
  },
  "John Wolford": {
    name: "John Wolford",
    wins: 1,
    teams: ["Los Angeles Rams", "Jacksonville Jaguars"]
  },
  "Logan Woodside": {
    name: "Logan Woodside",
    wins: 0,
    teams: ["Tennessee Titans", "Atlanta Falcons", "Cincinnati Bengals"]
  },
  "Bryce Young": {
    name: "Bryce Young",
    wins: 6,
    teams: ["Carolina Panthers"]
  },
  "Bailey Zappe": {
    name: "Bailey Zappe",
    wins: 4,
    teams: ["New England Patriots", "Kansas City Chiefs"]
  },
  "Ken O'Brien": {
    name: "Ken O'Brien",
    wins: 50,
    teams: ["Jets", "Eagles"],
    ties: 1
  },
  "Chad Pennington": {
    name: "Chad Pennington",
    wins: 44,
    teams: ["Jets", "Dolphins"],
    ties: 0
  },
  "Richard Todd": {
    name: "Richard Todd",
    wins: 48,
    teams: ["Jets", "Saints"],
    ties: 1
  }
};

// Function to normalize team names
export const normalizeTeamName = (team: string): string => {
  const teamChanges: { [key: string]: string } = {
    // Historical changes
    'San Diego Chargers': 'Los Angeles Chargers',
    'Oakland Raiders': 'Las Vegas Raiders',
    'St. Louis Rams': 'Los Angeles Rams',
    'Houston Oilers': 'Tennessee Titans',
    'Baltimore Colts': 'Indianapolis Colts',
    'St. Louis Cardinals': 'Arizona Cardinals',
    
    // Current teams (for standardization)
    'Arizona Cardinals': 'Arizona Cardinals',
    'Atlanta Falcons': 'Atlanta Falcons',
    'Baltimore Ravens': 'Baltimore Ravens',
    'Buffalo Bills': 'Buffalo Bills',
    'Carolina Panthers': 'Carolina Panthers',
    'Chicago Bears': 'Chicago Bears',
    'Cincinnati Bengals': 'Cincinnati Bengals',
    'Cleveland Browns': 'Cleveland Browns',
    'Dallas Cowboys': 'Dallas Cowboys',
    'Denver Broncos': 'Denver Broncos',
    'Detroit Lions': 'Detroit Lions',
    'Green Bay Packers': 'Green Bay Packers',
    'Houston Texans': 'Houston Texans',
    'Indianapolis Colts': 'Indianapolis Colts',
    'Jacksonville Jaguars': 'Jacksonville Jaguars',
    'Kansas City Chiefs': 'Kansas City Chiefs',
    'Las Vegas Raiders': 'Las Vegas Raiders',
    'Los Angeles Chargers': 'Los Angeles Chargers',
    'Los Angeles Rams': 'Los Angeles Rams',
    'Miami Dolphins': 'Miami Dolphins',
    'Minnesota Vikings': 'Minnesota Vikings',
    'New England Patriots': 'New England Patriots',
    'New Orleans Saints': 'New Orleans Saints',
    'New York Giants': 'New York Giants',
    'New York Jets': 'New York Jets',
    'Philadelphia Eagles': 'Philadelphia Eagles',
    'Pittsburgh Steelers': 'Pittsburgh Steelers',
    'San Francisco 49ers': 'San Francisco 49ers',
    'Seattle Seahawks': 'Seattle Seahawks',
    'Tampa Bay Buccaneers': 'Tampa Bay Buccaneers',
    'Tennessee Titans': 'Tennessee Titans',
    'Washington Commanders': 'Washington Commanders',
    
    // Short forms to full names
    'Cardinals': 'Arizona Cardinals',
    'Falcons': 'Atlanta Falcons',
    'Ravens': 'Baltimore Ravens',
    'Bills': 'Buffalo Bills',
    'Panthers': 'Carolina Panthers',
    'Bears': 'Chicago Bears',
    'Bengals': 'Cincinnati Bengals',
    'Browns': 'Cleveland Browns',
    'Cowboys': 'Dallas Cowboys',
    'Broncos': 'Denver Broncos',
    'Lions': 'Detroit Lions',
    'Packers': 'Green Bay Packers',
    'Texans': 'Houston Texans',
    'Colts': 'Indianapolis Colts',
    'Jaguars': 'Jacksonville Jaguars',
    'Chiefs': 'Kansas City Chiefs',
    'Raiders': 'Las Vegas Raiders',
    'Chargers': 'Los Angeles Chargers',
    'Rams': 'Los Angeles Rams',
    'Dolphins': 'Miami Dolphins',
    'Vikings': 'Minnesota Vikings',
    'Patriots': 'New England Patriots',
    'Saints': 'New Orleans Saints',
    'Giants': 'New York Giants',
    'Jets': 'New York Jets',
    'Eagles': 'Philadelphia Eagles',
    'Steelers': 'Pittsburgh Steelers',
    '49ers': 'San Francisco 49ers',
    'Seahawks': 'Seattle Seahawks',
    'Buccaneers': 'Tampa Bay Buccaneers',
    'Titans': 'Tennessee Titans',
    'Commanders': 'Washington Commanders'
  };
  return teamChanges[team] || team;
};

export function validateQB(qbName: string, team: string): QBData | null {
  // Try to find the closest match for the QB name
  const matchedName = findClosestMatch(qbName);
  if (!matchedName) return null;
  
  const qb = qbDatabase[matchedName];
  if (!qb) return null;
  
  // Normalize team names for comparison
  const normalizedCurrentTeam = normalizeTeamName(team);
  const normalizedQbTeams = qb.teams.map(normalizeTeamName);
  
  // Special case for Baltimore Colts/Indianapolis Colts
  if (normalizedCurrentTeam === "Indianapolis Colts" && normalizedQbTeams.includes("Baltimore Colts")) {
    return qb;
  }
  
  if (!normalizedQbTeams.includes(normalizedCurrentTeam)) return null;
  
  return qb;
}

// Function to format QB display name
export function formatQBDisplayName(input: string, fullName: string): string {
  const normalizedInput = input.toLowerCase().trim();
  
  // If input is a recognized nickname, show "Full Name / 'Nickname'"
  const nicknameEntry = Object.entries(QB_NICKNAMES).find(([nickname]) => 
    nickname.toLowerCase() === normalizedInput
  );
  if (nicknameEntry) {
    return `${fullName} / '${nicknameEntry[0]}'`;
  }
  
  // If input is a last name, just show the full name
  const lastNameMatch = Object.entries(qbDatabase).find(([fullName]) => {
    const lastName = fullName.split(' ').pop()?.toLowerCase();
    return lastName === normalizedInput;
  });
  if (lastNameMatch) {
    return lastNameMatch[0];
  }

  // For exact matches, show full name only
  if (normalizedInput === fullName.toLowerCase()) {
    return fullName;
  }

  // For any other case, show the full name
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