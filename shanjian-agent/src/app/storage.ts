export function loadJson<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  if (typeof window.localStorage?.getItem !== 'function') return fallback;

  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveJson<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  if (typeof window.localStorage?.setItem !== 'function') return;

  window.localStorage.setItem(key, JSON.stringify(value));
}
