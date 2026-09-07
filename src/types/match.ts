export type MatchOutcome = 'win' | 'loss' | 'draw';

export interface TryScorer {
  player: string;
  count: number;
  notes?: string;
}

export interface DefensiveHighlight {
  player: string;
  action: string;
}

export interface Casualty {
  player: string;
  reason: string;
  isSelfInflicted?: boolean;
}

export interface Controversy {
  title: string;
  description: string;
}

export interface MatchScore {
  us: number;
  them: number;
  halfTimeUs: number;
  halfTimeThem: number;
  outcome: MatchOutcome;
}

export interface MatchReport {
  id: string;
  date: string;
  round: string;
  season: string;
  teamName: string;
  opponent: string;
  score: MatchScore;
  dadQuote: string;
  headline?: string;
  rawSmsText: string;
  storyParagraphs: string[];
  tryScorers: TryScorer[];
  defensiveHighlights: DefensiveHighlight[];
  casualtyWard: Casualty[];
  controversies: Controversy[];
  venueNotes?: string;
  squadNotes?: string;
  squadPresent: string[];
  squadMissing: string[];
  awards?: {
    playerOfTheMatch?: string;
    momentOfTheMatch?: string;
    quoteOfTheMatch?: string;
  };
}

export interface PlayerProfile {
  id: string;
  name: string;
  nickname?: string;
  roleDescription?: string;
  tags?: string[];
  avatarEmoji?: string;
}
