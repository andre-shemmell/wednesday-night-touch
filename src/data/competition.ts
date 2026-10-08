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
            team: "Hunt and Kill",
            played: 6,
            won: 4,
            drawn: 0,
            lost: 2,
            pointsFor: 33,
            pointsAgainst: 25,
            diff: 8,
            points: 14,
            isPointTakeaway: false
        },
        {
            pos: 2,
            team: "The Touchers",
            played: 6,
            won: 4,
            drawn: 0,
            lost: 2,
            pointsFor: 34,
            pointsAgainst: 28,
            diff: 6,
            points: 14,
            isPointTakeaway: false
        },
        {
            pos: 3,
            team: "Point Takeaway",
            played: 6,
            won: 3,
            drawn: 1,
            lost: 2,
            pointsFor: 40,
            pointsAgainst: 34,
            diff: 6,
            points: 13,
            isPointTakeaway: true
        },
        {
            pos: 4,
            team: "United",
            played: 6,
            won: 2,
            drawn: 3,
            lost: 1,
            pointsFor: 38,
            pointsAgainst: 36,
            diff: 2,
            points: 13,
            isPointTakeaway: false
        },
        {
            pos: 5,
            team: "Bonsai",
            played: 6,
            won: 3,
            drawn: 1,
            lost: 2,
            pointsFor: 30,
            pointsAgainst: 32,
            diff: -2,
            points: 13,
            isPointTakeaway: false
        },
        {
            pos: 6,
            team: "Screws",
            played: 6,
            won: 2,
            drawn: 1,
            lost: 3,
            pointsFor: 25,
            pointsAgainst: 30,
            diff: -5,
            points: 11,
            isPointTakeaway: false
        },
        {
            pos: 7,
            team: "The Well Hungarians",
            played: 6,
            won: 2,
            drawn: 0,
            lost: 4,
            pointsFor: 28,
            pointsAgainst: 36,
            diff: -8,
            points: 10,
            isPointTakeaway: false
        },
        {
            pos: 8,
            team: "Redlands Centurions",
            played: 6,
            won: 1,
            drawn: 0,
            lost: 5,
            pointsFor: 29,
            pointsAgainst: 36,
            diff: -7,
            points: 8,
            isPointTakeaway: false
        }
    ],
  divisionResults: [
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
      round: 'Round 11',
      date: 'Wednesday, 14 October 2026',
      time: '7:05 PM AEST (Brisbane)',
      opponent: 'Redlands Centurions',
      field: 'Field 9',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: 'Confirmed local kickoff: 7:05 PM AEST (Brisbane time / 8:05 PM AEDT Sydney) on Field 9 vs Centurions.'
    },
    {
      round: 'Round 12',
      date: 'Wednesday, 21 October 2026',
      time: '8:15 PM AEST (Brisbane)',
      opponent: 'Hunt and Kill (Double Header Game 1)',
      field: 'Field 6',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: '🔥 Double Header Night! Game 1 vs Hunt and Kill confirmed for 8:15 PM AEST. 2nd fixture timeslot & opponent pending official association release.'
    }
  ]
};
