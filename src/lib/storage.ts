import type { Letter } from "./types";

const KEY = "qiaopi:letters:v1";
const DRAFT_KEY = "qiaopi:draft:v1";

export function saveLetter(letter: Letter) {
  if (typeof window === "undefined") return;
  const all = loadLetters();
  all.unshift(letter);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 200)));
}

export function loadLetters(): Letter[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Letter[];
  } catch {
    return [];
  }
}

export function saveDraft(letter: Partial<Letter>) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(DRAFT_KEY, JSON.stringify(letter));
}

export function loadDraft(): Partial<Letter> | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(DRAFT_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<Letter>;
  } catch {
    return null;
  }
}

export function clearDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(DRAFT_KEY);
}

export function newId(): string {
  return "L_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}
