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
    { pos: 1, team: 'Bonsai', played: 3, won: 2, drawn: 1, lost: 0, pointsFor: 22, pointsAgainst: 16, diff: 6, points: 8 },
    { pos: 2, team: 'Hunt and Kill', played: 3, won: 2, drawn: 0, lost: 1, pointsFor: 16, pointsAgainst: 10, diff: 6, points: 7 },
    { pos: 3, team: 'The Touchers', played: 3, won: 2, drawn: 0, lost: 1, pointsFor: 19, pointsAgainst: 17, diff: 2, points: 7 },
    { pos: 4, team: 'Point Takeaway', played: 3, won: 2, drawn: 0, lost: 1, pointsFor: 15, pointsAgainst: 16, diff: -1, points: 7, isPointTakeaway: true },
    { pos: 5, team: 'Redlands Centurions', played: 3, won: 1, drawn: 0, lost: 2, pointsFor: 15, pointsAgainst: 14, diff: 1, points: 5 },
    { pos: 6, team: 'The Well Hungarians', played: 3, won: 1, drawn: 0, lost: 2, pointsFor: 11, pointsAgainst: 14, diff: -3, points: 5 },
    { pos: 7, team: 'United', played: 3, won: 0, drawn: 2, lost: 1, pointsFor: 12, pointsAgainst: 17, diff: -5, points: 5 },
    { pos: 8, team: 'Screws', played: 3, won: 0, drawn: 1, lost: 2, pointsFor: 11, pointsAgainst: 17, diff: -6, points: 4 },
  ],
  upcomingFixtures: [
    {
      round: 'Round 8',
      date: 'Wednesday, 9 September 2026',
      time: '7:05 PM',
      opponent: 'Bonsai',
      field: 'Field 5',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: 'Top-of-the-table clash! 4th vs 1st. A win could catapult Point Takeaway into 1st or 2nd place on the ladder.'
    },
    {
      round: 'Round 9',
      date: 'Wednesday, 30 September 2026',
      time: '7:55 PM',
      opponent: 'United',
      field: 'Field 5',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: 'Prime time evening slot under the lights.'
    },
    {
      round: 'Round 10',
      date: 'Wednesday, 7 October 2026',
      time: '6:15 PM',
      opponent: 'Screws',
      field: 'Field 5',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: 'Rematch against long-time rivals Screws (beaten 7-2 in Autumn/Winter).'
    }
  ]
};
