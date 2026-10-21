export interface LadderEntry {
  pos: number;
  team: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  pointsFor: number;
  pointsAgainst: number;
  diff: number;
  points: number;
  isPointTakeaway?: boolean;
}

export interface UpcomingFixture {
  round: string;
  date: string;
  time: string;
  opponent: string;
  field: string;
  venue: string;
  notes: string;
}

export interface DivisionMatchResult {
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  field: string;
  notes?: string;
}

export interface DivisionRoundResults {
  round: string;
  date: string;
  matches: DivisionMatchResult[];
}

export interface CompDetails {
  associationName: string;
  associationWebsite: string;
  associationPortalUrl: string;
  competitionName: string;
  grade: string;
  venueName: string;
  venueAddress: string;
  teamContactName: string;
  teamContactRole: string;
  ladder: LadderEntry[];
  divisionResults: DivisionRoundResults[];
  upcomingFixtures: UpcomingFixture[];
}

export const COMPETITION_DETAILS: CompDetails = {
  associationName: 'Redlands Touch Association (Touch Football Australia)',
  associationWebsite: 'https://redlandstouch.com.au',
  associationPortalUrl: 'https://tfa.mysideline.com.au/competitions/association/4556?label=Redlands%20Touch%20Association&type=association',
  competitionName: 'Redlands Seniors S2 2026 Wednesday Mens A/B, C/D, E/F GRADE',
  grade: 'E/F Grade',
  venueName: 'Redlands Showgrounds',
  venueAddress: 'Long Street, Cleveland QLD 4163',
  teamContactName: 'Graeme Shemmell',
  teamContactRole: 'Registered Team Manager & Gaffer',
  ladder: [
        {
            pos: 1,
            team: "Point Takeaway",
            played: 9,
            won: 6,
            drawn: 1,
            lost: 2,
            pointsFor: 54,
            pointsAgainst: 37,
            diff: 17,
            points: 22,
            isPointTakeaway: true
        },
        {
            pos: 2,
            team: "Bonsai",
            played: 9,
            won: 6,
            drawn: 1,
            lost: 2,
            pointsFor: 50,
            pointsAgainst: 41,
            diff: 9,
            points: 22,
            isPointTakeaway: false
        },
        {
            pos: 3,
            team: "The Touchers",
            played: 9,
            won: 6,
            drawn: 0,
            lost: 3,
            pointsFor: 48,
            pointsAgainst: 35,
            diff: 13,
            points: 21,
            isPointTakeaway: false
        },
        {
            pos: 4,
            team: "Hunt and Kill",
            played: 9,
            won: 5,
            drawn: 0,
            lost: 4,
            pointsFor: 42,
            pointsAgainst: 33,
            diff: 9,
            points: 19,
            isPointTakeaway: false
        },
        {
            pos: 5,
            team: "The Well Hungarians",
            played: 9,
            won: 4,
            drawn: 0,
            lost: 5,
            pointsFor: 36,
            pointsAgainst: 47,
            diff: -11,
            points: 17,
            isPointTakeaway: false
        },
        {
            pos: 6,
            team: "United",
            played: 9,
            won: 2,
            drawn: 3,
            lost: 4,
            pointsFor: 45,
            pointsAgainst: 54,
            diff: -9,
            points: 16,
            isPointTakeaway: false
        },
        {
            pos: 7,
            team: "Screws",
            played: 9,
            won: 3,
            drawn: 1,
            lost: 5,
            pointsFor: 32,
            pointsAgainst: 41,
            diff: -9,
            points: 16,
            isPointTakeaway: false
        },
        {
            pos: 8,
            team: "Redlands Centurions",
            played: 9,
            won: 1,
            drawn: 0,
            lost: 8,
            pointsFor: 36,
            pointsAgainst: 55,
            diff: -19,
            points: 11,
            isPointTakeaway: false
        }
    ],
  divisionResults: [
    {
      round: 'Round 13 (Double Header Game 2)',
      date: 'Wednesday, 21 October 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'The Touchers', homeScore: 4, awayScore: 0, field: 'Field 6', notes: 'Sensational 4-0 clean-sheet shutout over ladder leaders; Point Takeaway claim outright 1st place!' }
      ]
    },
    {
      round: 'Round 12 (Double Header Game 1)',
      date: 'Wednesday, 21 October 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'Hunt and Kill', homeScore: 3, awayScore: 1, field: 'Field 6', notes: 'Mitch opener, Peter & Reece tries; 3-1 stunner over 2nd-placed Hunt and Kill' }
      ]
    },
    {
      round: 'Round 11',
      date: 'Wednesday, 14 October 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'Redlands Centurions', homeScore: 7, awayScore: 2, field: 'Field 9', notes: 'Reece double, Mack bullet try; near to our best in 7-2 clinic' },
        { homeTeam: 'The Touchers', awayTeam: 'United', homeScore: 8, awayScore: 2, field: 'Field 8', notes: 'Touchers clinical victory' },
        { homeTeam: 'Hunt and Kill', awayTeam: 'Screws', homeScore: 6, awayScore: 2, field: 'Field 10', notes: 'Hunt and Kill power through' },
        { homeTeam: 'Bonsai', awayTeam: 'The Well Hungarians', homeScore: 8, awayScore: 3, field: 'Field 7', notes: 'Bonsai maintain top 4 buffer' }
      ]
    },
    {
      round: 'Round 10',
      date: 'Wednesday, 7 October 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'Screws', homeScore: 13, awayScore: 4, field: 'Field 5', notes: '5-on-5 open-field masterclass; Mitch (4 tries) & Dylan (4 tries) run riot' },
        { homeTeam: 'Hunt and Kill', awayTeam: 'The Touchers', homeScore: 7, awayScore: 5, field: 'Field 2', notes: 'Hunt and Kill hold off Touchers late charge' },
        { homeTeam: 'Bonsai', awayTeam: 'The Well Hungarians', homeScore: 8, awayScore: 4, field: 'Field 3', notes: 'Bonsai keep unbeaten run alive' },
        { homeTeam: 'United', awayTeam: 'Redlands Centurions', homeScore: 6, awayScore: 3, field: 'Field 8', notes: 'United grind out tight win' }
      ]
    },
    {
      round: 'Round 9',
      date: 'Wednesday, 30 September 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'United', homeScore: 6, awayScore: 6, field: 'Field 5', notes: "Cam's siren equalizer; 8 blokes battle to epic 6-6 draw" },
        { homeTeam: 'The Touchers', awayTeam: 'The Well Hungarians', homeScore: 0, awayScore: 0, field: 'Field 2', notes: 'Scoreless stalemate' },
        { homeTeam: 'Bonsai', awayTeam: 'Redlands Centurions', homeScore: 0, awayScore: 0, field: 'Field 3', notes: 'Bye / Washout' },
        { homeTeam: 'Hunt and Kill', awayTeam: 'Screws', homeScore: 0, awayScore: 0, field: 'Field 10', notes: 'Rescheduled match' }
      ]
    },
    {
      round: 'Round 8',
      date: 'Wednesday, 9 September 2026',
      matches: [
        { homeTeam: 'Bonsai', awayTeam: 'Point Takeaway', homeScore: 8, awayScore: 6, field: 'Field 5', notes: 'Matt hat-trick; heroic comeback with 7 blokes' },
        { homeTeam: 'United', awayTeam: 'The Well Hungarians', homeScore: 13, awayScore: 8, field: 'Field 10', notes: 'Wild 21-try shootout' },
        { homeTeam: 'Hunt and Kill', awayTeam: 'Redlands Centurions', homeScore: 10, awayScore: 0, field: 'Field 3', notes: 'Shutout victory' },
        { homeTeam: 'Screws', awayTeam: 'The Touchers', homeScore: 0, awayScore: 0, field: 'Field 2', notes: 'Scoreless draw' }
      ]
    },
    {
      round: 'Round 7',
      date: 'Wednesday, 2 September 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'The Well Hungarians', homeScore: 5, awayScore: 3, field: 'Field 2', notes: 'Dylan double; Nev "A Great Leave"' },
        { homeTeam: 'Bonsai', awayTeam: 'The Touchers', homeScore: 10, awayScore: 5, field: 'Field 5' },
        { homeTeam: 'Redlands Centurions', awayTeam: 'Screws', homeScore: 7, awayScore: 2, field: 'Field 10' },
        { homeTeam: 'Hunt and Kill', awayTeam: 'United', homeScore: 0, awayScore: 0, field: 'Field 3' }
      ]
    },
    {
      round: 'Round 6',
      date: 'Wednesday, 26 August 2026',
      matches: [
        { homeTeam: 'The Touchers', awayTeam: 'Point Takeaway', homeScore: 8, awayScore: 4, field: 'Field 8' },
        { homeTeam: 'Bonsai', awayTeam: 'Redlands Centurions', homeScore: 6, awayScore: 5, field: 'Field 3' },
        { homeTeam: 'Hunt and Kill', awayTeam: 'The Well Hungarians', homeScore: 6, awayScore: 4, field: 'Field 2' },
        { homeTeam: 'United', awayTeam: 'Screws', homeScore: 6, awayScore: 6, field: 'Field 5' }
      ]
    },
    {
      round: 'Round 5',
      date: 'Wednesday, 19 August 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'Hunt and Kill', homeScore: 6, awayScore: 5, field: 'Field 5', notes: 'Joel buzzer-beater match winner' },
        { homeTeam: 'The Touchers', awayTeam: 'Redlands Centurions', homeScore: 6, awayScore: 3, field: 'Field 3' },
        { homeTeam: 'The Well Hungarians', awayTeam: 'Screws', homeScore: 4, awayScore: 3, field: 'Field 2' },
        { homeTeam: 'United', awayTeam: 'Bonsai', homeScore: 6, awayScore: 6, field: 'Field 10' }
      ]
    }
  ],
  upcomingFixtures: [
    {
      round: 'Round 14',
      date: 'Wednesday, 28 October 2026',
      time: '6:15 PM AEST (Brisbane)',
      opponent: 'The Well Hungarians',
      field: 'Field 3',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: '🔥 Penultimate regular season clash: 6:15 PM AEST (7:15 PM AEDT Sydney) on Field 3 vs The Well Hungarians.'
    },
    {
      round: 'Round 15',
      date: 'Wednesday, 4 November 2026',
      time: '7:05 PM AEST (Brisbane)',
      opponent: 'Bonsai',
      field: 'Field 2',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: '🔥 Final regular round before finals: 7:05 PM AEST (8:05 PM AEDT Sydney) on Field 2 vs Bonsai.'
    }
  ]
};
