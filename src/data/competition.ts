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
            played: 10,
            won: 7,
            drawn: 1,
            lost: 2,
            pointsFor: 66,
            pointsAgainst: 38,
            diff: 28,
            points: 25,
            isPointTakeaway: true
        },
        {
            pos: 2,
            team: "Bonsai",
            played: 10,
            won: 7,
            drawn: 1,
            lost: 2,
            pointsFor: 57,
            pointsAgainst: 47,
            diff: 10,
            points: 25,
            isPointTakeaway: false
        },
        {
            pos: 3,
            team: "The Touchers",
            played: 10,
            won: 6,
            drawn: 0,
            lost: 4,
            pointsFor: 54,
            pointsAgainst: 42,
            diff: 12,
            points: 22,
            isPointTakeaway: false
        },
        {
            pos: 4,
            team: "Hunt and Kill",
            played: 10,
            won: 5,
            drawn: 0,
            lost: 5,
            pointsFor: 46,
            pointsAgainst: 40,
            diff: 6,
            points: 20,
            isPointTakeaway: false
        },
        {
            pos: 5,
            team: "United",
            played: 10,
            won: 3,
            drawn: 3,
            lost: 4,
            pointsFor: 52,
            pointsAgainst: 58,
            diff: -6,
            points: 19,
            isPointTakeaway: false
        },
        {
            pos: 6,
            team: "Screws",
            played: 10,
            won: 4,
            drawn: 1,
            lost: 5,
            pointsFor: 40,
            pointsAgainst: 47,
            diff: -7,
            points: 19,
            isPointTakeaway: false
        },
        {
            pos: 7,
            team: "The Well Hungarians",
            played: 10,
            won: 4,
            drawn: 0,
            lost: 6,
            pointsFor: 37,
            pointsAgainst: 59,
            diff: -22,
            points: 18,
            isPointTakeaway: false
        },
        {
            pos: 8,
            team: "Redlands Centurions",
            played: 10,
            won: 1,
            drawn: 0,
            lost: 9,
            pointsFor: 42,
            pointsAgainst: 63,
            diff: -21,
            points: 12,
            isPointTakeaway: false
        }
    ],
  divisionResults: [
    {
      round: 'Semi-Finals (Finals Week 1 Washout)',
      date: 'Wednesday, 11 November 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'Hunt and Kill', homeScore: 0, awayScore: 0, field: 'Field 2', notes: 'E Grade Semi-Final (7:05 PM) — Washout / Cancelled due to severe Redlands storm, flooding roads & ongoing lightning strikes near Cleveland' },
        { homeTeam: 'Bonsai', awayTeam: 'The Touchers', homeScore: 0, awayScore: 0, field: 'Field 1', notes: 'E Grade Semi-Final (7:05 PM) — Washout / Cancelled due to severe lightning storm' },
        { homeTeam: 'United', awayTeam: 'Redlands Centurions', homeScore: 0, awayScore: 0, field: 'Field 3', notes: 'F Grade Semi-Final (7:05 PM) — Washout / Cancelled due to severe lightning storm' },
        { homeTeam: 'Screws', awayTeam: 'The Well Hungarians', homeScore: 0, awayScore: 0, field: 'Field 4', notes: 'F Grade Semi-Final (7:05 PM) — Washout / Cancelled due to severe lightning storm' }
      ]
    },
    {
      round: 'Round 15',
      date: 'Wednesday, 4 November 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'The Well Hungarians', homeScore: 12, awayScore: 1, field: 'Field 3', notes: 'Historic 12-1 demolition on green carpet; Joel (3) & Mitch (3) bag hat-tricks as Point Takeaway claim Minor Premiership!' },
        { homeTeam: 'Bonsai', awayTeam: 'The Touchers', homeScore: 7, awayScore: 6, field: 'Field 4', notes: 'Bonsai edge out Touchers 7-6 to seal 2nd spot' },
        { homeTeam: 'United', awayTeam: 'Hunt and Kill', homeScore: 7, awayScore: 4, field: 'Field 5', notes: 'United upset Hunt and Kill 7-4' },
        { homeTeam: 'Screws', awayTeam: 'Redlands Centurions', homeScore: 8, awayScore: 6, field: 'Field 9', notes: 'Screws high-scoring 8-6 win over Centurions' }
      ]
    },
    {
      round: 'Round 14',
      date: 'Wednesday, 28 October 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'The Well Hungarians', homeScore: 0, awayScore: 0, field: 'Field 3', notes: 'Washout / Cancelled due to waterlogged fields after heavy rain' },
        { homeTeam: 'Bonsai', awayTeam: 'Hunt and Kill', homeScore: 0, awayScore: 0, field: 'Field 2', notes: 'Washout / Cancelled' },
        { homeTeam: 'The Touchers', awayTeam: 'Screws', homeScore: 0, awayScore: 0, field: 'Field 5', notes: 'Washout / Cancelled' },
        { homeTeam: 'United', awayTeam: 'Redlands Centurions', homeScore: 0, awayScore: 0, field: 'Field 8', notes: 'Washout / Cancelled' }
      ]
    },
    {
      round: 'Round 13 (Double Header Game 2)',
      date: 'Wednesday, 21 October 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'The Touchers', homeScore: 4, awayScore: 0, field: 'Field 6', notes: 'Sensational 4-0 clean-sheet shutout over ladder leaders; Point Takeaway claim outright 1st place!' },
        { homeTeam: 'Redlands Centurions', awayTeam: 'Bonsai', homeScore: 4, awayScore: 6, field: 'Field 5', notes: 'Bonsai hold off Centurions 6-4 at 8:45 PM' },
        { homeTeam: 'Screws', awayTeam: 'United', homeScore: 4, awayScore: 3, field: 'Field 7', notes: 'Screws snatch tight 4-3 sprint win' },
        { homeTeam: 'Hunt and Kill', awayTeam: 'The Well Hungarians', homeScore: 2, awayScore: 3, field: 'Field 8', notes: 'Hungarians pull off 3-2 upset over Hunt and Kill' }
      ]
    },
    {
      round: 'Round 12 (Double Header Game 1)',
      date: 'Wednesday, 21 October 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'Hunt and Kill', homeScore: 3, awayScore: 1, field: 'Field 6', notes: 'Mitch opener, Peter & Reece tries; 3-1 stunner over 2nd-placed Hunt and Kill' },
        { homeTeam: 'Bonsai', awayTeam: 'United', homeScore: 6, awayScore: 2, field: 'Field 7', notes: 'Bonsai breeze past United 6-2 at 8:15 PM' },
        { homeTeam: 'The Touchers', awayTeam: 'Redlands Centurions', homeScore: 6, awayScore: 1, field: 'Field 8', notes: 'Touchers strong 6-1 sprint win' },
        { homeTeam: 'The Well Hungarians', awayTeam: 'Screws', homeScore: 2, awayScore: 1, field: 'Field 5', notes: 'Hungarians edge Screws 2-1' }
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
        { homeTeam: 'The Touchers', awayTeam: 'The Well Hungarians', homeScore: 9, awayScore: 4, field: 'Field 10', notes: 'Touchers clinically handle Hungarians' },
        { homeTeam: 'United', awayTeam: 'Redlands Centurions', homeScore: 7, awayScore: 5, field: 'Field 3', notes: 'United prevail in 12-try shootout' },
        { homeTeam: 'Hunt and Kill', awayTeam: 'Bonsai', homeScore: 0, awayScore: 0, field: 'Field 2', notes: 'Forfeit result (Hunt and Kill awarded forfeit win)' }
      ]
    },
    {
      round: 'Round 9',
      date: 'Wednesday, 30 September 2026',
      matches: [
        { homeTeam: 'Point Takeaway', awayTeam: 'United', homeScore: 6, awayScore: 6, field: 'Field 5', notes: "Cam's siren equalizer; 8 blokes battle to epic 6-6 draw" },
        { homeTeam: 'The Touchers', awayTeam: 'Hunt and Kill', homeScore: 6, awayScore: 2, field: 'Field 2', notes: 'Touchers pull clear over Hunt and Kill' },
        { homeTeam: 'Screws', awayTeam: 'Bonsai', homeScore: 0, awayScore: 0, field: 'Field 8', notes: 'Forfeit result (Screws awarded forfeit win)' },
        { homeTeam: 'The Well Hungarians', awayTeam: 'Redlands Centurions', homeScore: 0, awayScore: 0, field: 'Field 3', notes: 'Forfeit result (Hungarians awarded forfeit win)' }
      ]
    },
    {
      round: 'Round 8',
      date: 'Wednesday, 9 September 2026',
      matches: [
        { homeTeam: 'Bonsai', awayTeam: 'Point Takeaway', homeScore: 8, awayScore: 6, field: 'Field 5', notes: 'Matt hat-trick; heroic comeback with 7 blokes' },
        { homeTeam: 'United', awayTeam: 'The Well Hungarians', homeScore: 13, awayScore: 8, field: 'Field 10', notes: 'Wild 21-try shootout' },
        { homeTeam: 'Hunt and Kill', awayTeam: 'Redlands Centurions', homeScore: 10, awayScore: 9, field: 'Field 3', notes: 'Thriller 10-9 victory for Hunt and Kill' },
        { homeTeam: 'Screws', awayTeam: 'The Touchers', homeScore: 0, awayScore: 0, field: 'Field 2', notes: 'Forfeit result (Screws awarded forfeit win)' }
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
      round: 'Grand Final (Expected 1 vs 2)',
      date: 'Wednesday, 18 November 2026',
      time: 'TBC (Redlands Grand Final Night)',
      opponent: 'Bonsai',
      field: 'Field TBC',
      venue: 'Redlands Showgrounds, Cleveland',
      notes: '🏆 GRAND FINAL SHOWDOWN (Expected 1 vs 2): Minor Premiers Point Takeaway (1st) take on 2nd-placed Bonsai following the Semi-Final lightning washout!'
    }
  ]
};
