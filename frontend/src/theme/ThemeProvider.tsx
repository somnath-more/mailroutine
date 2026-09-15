import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react'

import { ThemeContext } from './theme-context'
import {
  SYSTEM_THEME_QUERY,
  applyResolvedTheme,
  getSystemTheme,
  readThemePreference,
  resolveTheme,
  writeThemePreference,
  type ResolvedTheme,
  type ThemePreference,
} from './theme-storage'

export function ThemeProvider({ children }: PropsWithChildren) {
  const [preference, setStoredPreference] =
    useState<ThemePreference>(readThemePreference)
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getSystemTheme)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mediaQuery = window.matchMedia(SYSTEM_THEME_QUERY)
    const handleSystemThemeChange = () => setSystemTheme(getSystemTheme())

    handleSystemThemeChange()
    mediaQuery.addEventListener('change', handleSystemThemeChange)
    return () =>
      mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [])

  const resolvedTheme = resolveTheme(preference, systemTheme)

  useLayoutEffect(() => {
    applyResolvedTheme(resolvedTheme)
  }, [resolvedTheme])

  const setPreference = useCallback((nextPreference: ThemePreference) => {
    setStoredPreference(nextPreference)
    writeThemePreference(nextPreference)
  }, [])

  const value = useMemo(
    () => ({ preference, resolvedTheme, setPreference }),
    [preference, resolvedTheme, setPreference],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
