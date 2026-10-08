import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const compFilePath = path.join(rootDir, 'src', 'data', 'competition.ts');

export const TEAMS = [
  'Bonsai',
  'Hunt and Kill',
  'Point Takeaway',
  'United',
  'The Touchers',
  'Screws',
  'The Well Hungarians',
  'Redlands Centurions'
];

/**
 * Recalculates ladder standings based on all division rounds in competition.ts
 * TFA Scoring: Win = 3, Draw = 2, Loss = 1 (or 0 for unplayed/forfeit loss)
 */
export function recalculateLadderFromResults(divisionResults) {
  const stats = {};
  TEAMS.forEach(team => {
    stats[team] = {
      team,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      pointsFor: 0,
      pointsAgainst: 0,
      diff: 0,
      points: 0,
      isPointTakeaway: team === 'Point Takeaway'
    };
  });

  // Iterate chronologically through all matches in divisionResults
  divisionResults.forEach(roundData => {
    roundData.matches.forEach(m => {
      // Skip bye / non-matches (0-0 without played flags)
      const isByeOrWashout = (m.homeScore === 0 && m.awayScore === 0 && (m.notes?.includes('Bye') || m.notes?.includes('Washout') || m.notes?.includes('Rescheduled')));
      if (isByeOrWashout) {
        return;
      }

      const home = stats[m.homeTeam];
      const away = stats[m.awayTeam];

      if (!home || !away) {
        return;
      }

      home.played += 1;
      away.played += 1;
      home.pointsFor += m.homeScore;
      home.pointsAgainst += m.awayScore;
      away.pointsFor += m.awayScore;
      away.pointsAgainst += m.homeScore;

      if (m.homeScore > m.awayScore) {
        home.won += 1;
        home.points += 3;
        away.lost += 1;
        away.points += 1;
      } else if (m.awayScore > m.homeScore) {
        away.won += 1;
        away.points += 3;
        home.lost += 1;
        home.points += 1;
      } else {
        home.drawn += 1;
        home.points += 2;
        away.drawn += 1;
        away.points += 2;
      }

      home.diff = home.pointsFor - home.pointsAgainst;
      away.diff = away.pointsFor - away.pointsAgainst;
    });
  });

  // Sort by points desc, diff desc, pointsFor desc
  const sorted = Object.values(stats).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.diff !== a.diff) return b.diff - a.diff;
    return b.pointsFor - a.pointsFor;
  });

  return sorted.map((entry, idx) => ({
    pos: idx + 1,
    ...entry
  }));
}

export function syncCompetition() {
  console.log('🔄 Checking competition standings and division scores...');
  if (!fs.existsSync(compFilePath)) {
    console.error(`Error: Could not find ${compFilePath}`);
    process.exit(1);
  }

  let code = fs.readFileSync(compFilePath, 'utf8');

  // Extract divisionResults JSON array
  const match = code.match(/divisionResults:\s*(\[[\s\S]*?\n\s*\]),/);
  if (!match) {
    console.error('Could not parse divisionResults block in competition.ts');
    process.exit(1);
  }

  // Safely evaluate divisionResults structure
  const rawResultsStr = match[1];
  let divisionResults;
  try {
    const fn = new Function(`return ${rawResultsStr};`);
    divisionResults = fn();
  } catch (err) {
    console.error('Failed to parse divisionResults:', err);
    process.exit(1);
  }

  const updatedLadder = recalculateLadderFromResults(divisionResults);

  console.log('\n🏆 Current Recalculated Standings:');
  updatedLadder.forEach(t => {
    const star = t.isPointTakeaway ? ' ⭐' : '';
    console.log(
      `${t.pos}. ${t.team.padEnd(20)} P:${t.played} W:${t.won} D:${t.drawn} L:${t.lost} F:${t.pointsFor} A:${t.pointsAgainst} Diff:${t.diff >= 0 ? '+' : ''}${t.diff} Pts:${t.points}${star}`
    );
  });

  // Replace ladder block in competition.ts
  const formattedLadder = JSON.stringify(updatedLadder, null, 4)
    .replace(/"pos"/g, 'pos')
    .replace(/"team"/g, 'team')
    .replace(/"played"/g, 'played')
    .replace(/"won"/g, 'won')
    .replace(/"drawn"/g, 'drawn')
    .replace(/"lost"/g, 'lost')
    .replace(/"pointsFor"/g, 'pointsFor')
    .replace(/"pointsAgainst"/g, 'pointsAgainst')
    .replace(/"diff"/g, 'diff')
    .replace(/"points"/g, 'points')
    .replace(/"isPointTakeaway"/g, 'isPointTakeaway')
    .split('\n')
    .map((line, idx) => (idx === 0 ? line : '    ' + line))
    .join('\n');

  const ladderRegex = /ladder:\s*\[[\s\S]*?\n\s*\],/;
  const newCode = code.replace(ladderRegex, `ladder: ${formattedLadder},`);

  if (newCode !== code) {
    fs.writeFileSync(compFilePath, newCode, 'utf8');
    console.log('\n✅ competition.ts updated successfully with current standings.');
  } else {
    console.log('\n✅ Standings in competition.ts are already up to date.');
  }
}

// Run if called directly
syncCompetition();
