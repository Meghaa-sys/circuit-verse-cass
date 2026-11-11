/** Shared cinematic state: p = 0 → camera pushed into the lab, p = 1 → rest position. */
export const intro = { p: 1 };

const KEY = 'cv-intro-seen';

export function introSeen(): boolean {
  try {
    return sessionStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

export function markIntroSeen() {
  try {
    sessionStorage.setItem(KEY, '1');
  } catch {
    /* storage unavailable – intro simply replays next load */
  }
}
