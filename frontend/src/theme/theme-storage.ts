export type ThemePreference = 'light' | 'dark' | 'system'
export type ResolvedTheme = Exclude<ThemePreference, 'system'>

export const THEME_STORAGE_KEY = 'careerflow-theme'
export const SYSTEM_THEME_QUERY = '(prefers-color-scheme: dark)'

export function isThemePreference(value: string): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function readThemePreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'

  try {
    const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY)
    return storedTheme && isThemePreference(storedTheme)
      ? storedTheme
      : 'system'
  } catch {
    return 'system'
  }
}

export function writeThemePreference(preference: ThemePreference): void {
  if (typeof window === 'undefined') return

  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference)
  } catch {
    // The in-memory preference still works when storage is unavailable.
  }
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia(SYSTEM_THEME_QUERY).matches ? 'dark' : 'light'
}

export function resolveTheme(
  preference: ThemePreference,
  systemTheme = getSystemTheme(),
): ResolvedTheme {
  return preference === 'system' ? systemTheme : preference
}

export function applyResolvedTheme(theme: ResolvedTheme): void {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.theme = theme
  document.documentElement.style.colorScheme = theme
}

export function initializeTheme(): void {
  applyResolvedTheme(resolveTheme(readThemePreference()))
}
