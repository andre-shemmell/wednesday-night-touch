import { MatchReport } from '../types/match';
import initialMatchesRaw from '../data/matches.json';

const STORAGE_KEY = 'wednesday_touch_matches_v2';
const API_KEY_STORAGE = 'gemini_api_key_v1';
const MODEL_STORAGE = 'gemini_model_choice_v1';

export function getSavedMatches(): MatchReport[] {
  try {
    const local = localStorage.getItem(STORAGE_KEY);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
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
    return localStorage.getItem(MODEL_STORAGE) || 'gemini-2.5-flash';
  } catch {
    return 'gemini-2.5-flash';
  }
}

export function setStoredModel(model: string): void {
  try {
    localStorage.setItem(MODEL_STORAGE, model);
  } catch (e) {
    console.error(e);
  }
}
