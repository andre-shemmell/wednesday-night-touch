import { MatchReport } from '../types/match';
import initialMatchesRaw from '../data/matches.json';

const STORAGE_KEY = 'wednesday_touch_matches_v5';
const API_KEY_STORAGE = 'gemini_api_key_v1';
const MODEL_STORAGE = 'gemini_model_choice_v1';

export function getSavedMatches(): MatchReport[] {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Auto-correct any match date saved as 2026-03-25, 2026-10-01, or non-Wednesday back to 2026-09-30
        let modified = false;
        const sanitized = parsed.map((m: MatchReport, idx: number) => {
          if (
            m.date === '2026-03-25' ||
            m.date === '2026-10-01' ||
            (idx === 0 && m.date !== '2026-09-30' && m.date !== '2026-09-09') ||
            (m.round?.includes('9') && m.date !== '2026-09-30')
          ) {
            modified = true;
            return {
              ...m,
              date: '2026-09-30',
              round: m.round?.includes('Round') ? m.round : 'Round 9'
            };
          }
          return m;
        });

        if (modified) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized, null, 2));
        }

        return sanitized;
      }
    }
  } catch (e) {
    console.error('Failed to load matches from localStorage', e);
  }
  return initialMatchesRaw as MatchReport[];
}

export function saveMatch(match: MatchReport): MatchReport[] {
  const current = getSavedMatches();
  // Check if exists
  const existingIndex = current.findIndex(m => m.id === match.id);
  let updated: MatchReport[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = match;
  } else {
    updated = [match, ...current];
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated, null, 2));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
  return updated;
}

export function deleteMatch(id: string): MatchReport[] {
  const current = getSavedMatches();
  const updated = current.filter(m => m.id !== id);
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated, null, 2));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
  return updated;
}

export function resetMatchesToDefault(): MatchReport[] {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.error(e);
  }
  return initialMatchesRaw as MatchReport[];
}

export function getStoredApiKey(): string {
  try {
    return localStorage.getItem(API_KEY_STORAGE) || '';
  } catch {
    return '';
  }
}

export function setStoredApiKey(key: string): void {
  try {
    localStorage.setItem(API_KEY_STORAGE, key.trim());
  } catch (e) {
    console.error(e);
  }
}

export function getStoredModel(): string {
  try {
    return localStorage.getItem(MODEL_STORAGE) || 'gemini-3.8-flash';
  } catch {
    return 'gemini-3.8-flash';
  }
}

export function setStoredModel(model: string): void {
  try {
    localStorage.setItem(MODEL_STORAGE, model);
  } catch (e) {
    console.error(e);
  }
}
