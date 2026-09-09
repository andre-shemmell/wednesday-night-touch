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
    { pos: 1, team: 'Bonsai', played: 4, won: 3, drawn: 1, lost: 0, pointsFor: 30, pointsAgainst: 22, diff: 8, points: 11 },
    { pos: 2, team: 'Hunt and Kill', played: 4, won: 3, drawn: 0, lost: 1, pointsFor: 26, pointsAgainst: 10, diff: 16, points: 10 },
    { pos: 3, team: 'United', played: 4, won: 1, drawn: 2, lost: 1, pointsFor: 25, pointsAgainst: 25, diff: 0, points: 8 },
    { pos: 4, team: 'The Touchers', played: 4, won: 2, drawn: 0, lost: 2, pointsFor: 19, pointsAgainst: 22, diff: -3, points: 8 },
    { pos: 5, team: 'Point Takeaway', played: 4, won: 2, drawn: 0, lost: 2, pointsFor: 21, pointsAgainst: 24, diff: -3, points: 8, isPointTakeaway: true },
    { pos: 6, team: 'Screws', played: 4, won: 1, drawn: 1, lost: 2, pointsFor: 16, pointsAgainst: 17, diff: -1, points: 7 },
    { pos: 7, team: 'The Well Hungarians', played: 4, won: 1, drawn: 0, lost: 3, pointsFor: 19, pointsAgainst: 27, diff: -8, points: 6 },
    { pos: 8, team: 'Redlands Centurions', played: 4, won: 1, drawn: 0, lost: 3, pointsFor: 15, pointsAgainst: 24, diff: -9, points: 6 },
  ],
  divisionResults: [
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
      round: 'Round 9',
      date: 'Wednesday, 30 September 2026',
      time: '7:55 PM',
      opponent: 'United',
      field: 'Field 5',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: 'Crucial 3rd vs 5th showdown! Both teams locked on 8 points. Winner breaks into the top 3.'
    },
    {
      round: 'Round 10',
      date: 'Wednesday, 7 October 2026',
      time: '6:15 PM',
      opponent: 'Screws',
      field: 'Field 5',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: 'Rematch against long-time rivals Screws (beaten 7-2 in Autumn/Winter).'
    },
    {
      round: 'Round 11',
      date: 'Wednesday, 14 October 2026',
      time: '7:05 PM',
      opponent: 'Hunt and Kill',
      field: 'Field 2',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: 'High-stakes clash against 2nd-place Hunt and Kill.'
    }
  ]
};
