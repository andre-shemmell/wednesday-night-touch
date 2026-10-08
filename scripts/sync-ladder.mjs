import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const compFilePath = path.join(rootDir, 'src', 'data', 'competition.ts');

const NRL_GRAPHQL_ENDPOINT = 'https://community-backend.api.nationalrugbyleague.io/graphql';
const REDLANDS_WEDNESDAY_COMP_ID = 69349014;

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

const LADDER_QUERY = `
query CompetitionLadder($competitionId: Int!) {
  competitionLadder(competitionId: $competitionId) {
    teams {
      _id
      name
      ageLvl
      pool
      avatar
      stats {
        totalMatchPoints
        pointsDifference
        pointsFor
        pointsAgainst
        matchesPlayed
        matchesWon
        matchesLost
        matchesDrawn
        byes
      }
    }
  }
}
`;

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

  divisionResults.forEach(roundData => {
    roundData.matches.forEach(m => {
      const isByeOrWashout = (m.homeScore === 0 && m.awayScore === 0 && (m.notes?.includes('Bye') || m.notes?.includes('Washout') || m.notes?.includes('Rescheduled')));
      if (isByeOrWashout) return;

      const home = stats[m.homeTeam];
      const away = stats[m.awayTeam];
      if (!home || !away) return;

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

export async function fetchLiveLadderFromAPI() {
  console.log(`🌐 Fetching official live ladder from NRL Community API for comp ID ${REDLANDS_WEDNESDAY_COMP_ID}...`);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const res = await fetch(NRL_GRAPHQL_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({
        operationName: 'CompetitionLadder',
        variables: { competitionId: REDLANDS_WEDNESDAY_COMP_ID },
        query: LADDER_QUERY
      }),
      signal: controller.signal
    });

    clearTimeout(timeout);

    if (!res.ok) {
      console.warn(`API returned status ${res.status}. Falling back to division results calculation.`);
      return null;
    }

    const data = await res.json();
    const allTeams = data.data?.competitionLadder?.teams || [];
    const efTeams = allTeams.filter(t => t.pool === 'E/F GRADE');
    if (!efTeams.length) {
      console.warn('Could not find E/F GRADE pool in API response.');
      return null;
    }

    const sorted = efTeams.sort((a, b) => {
      const sa = a.stats || {};
      const sb = b.stats || {};
      if (sb.totalMatchPoints !== sa.totalMatchPoints) return (sb.totalMatchPoints || 0) - (sa.totalMatchPoints || 0);
      if (sb.pointsDifference !== sa.pointsDifference) return (sb.pointsDifference || 0) - (sa.pointsDifference || 0);
      return (sb.pointsFor || 0) - (sa.pointsFor || 0);
    });

    return sorted.map((t, idx) => {
      const s = t.stats || {};
      return {
        pos: idx + 1,
        team: t.name,
        played: s.matchesPlayed || 0,
        won: s.matchesWon || 0,
        drawn: s.matchesDrawn || 0,
        lost: s.matchesLost || 0,
        pointsFor: s.pointsFor || 0,
        pointsAgainst: s.pointsAgainst || 0,
        diff: s.pointsDifference || 0,
        points: s.totalMatchPoints || 0,
        isPointTakeaway: t.name === 'Point Takeaway'
      };
    });
  } catch (err) {
    console.warn('Live API request failed or timed out:', err.message);
    return null;
  }
}

export async function syncCompetition() {
  console.log('🔄 Checking competition standings and division scores...');
  if (!fs.existsSync(compFilePath)) {
    console.error(`Error: Could not find ${compFilePath}`);
    process.exit(1);
  }

  let code = fs.readFileSync(compFilePath, 'utf8');

  // Try fetching live ladder from NRL official API first
  let updatedLadder = await fetchLiveLadderFromAPI();

  if (!updatedLadder) {
    console.log('⚡ Using divisionResults recalculation engine...');
    const match = code.match(/divisionResults:\s*(\[[\s\S]*?\n\s*\]),/);
    if (!match) {
      console.error('Could not parse divisionResults block in competition.ts');
      process.exit(1);
    }
    const rawResultsStr = match[1];
    const fn = new Function(`return ${rawResultsStr};`);
    const divisionResults = fn();
    updatedLadder = recalculateLadderFromResults(divisionResults);
  }

  console.log('\n🏆 Verified Standings:');
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

syncCompetition();
