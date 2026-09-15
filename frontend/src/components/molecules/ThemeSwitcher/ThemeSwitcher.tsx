import { Palette } from 'lucide-react'
import type { ChangeEvent } from 'react'

import { isThemePreference } from '../../../theme/theme-storage'
import { useTheme } from '../../../theme/useTheme'

export function ThemeSwitcher() {
  const { preference, setPreference } = useTheme()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    if (isThemePreference(event.target.value)) {
      setPreference(event.target.value)
    }
  }

  return (
    <label className="theme-switcher">
      <Palette size={17} strokeWidth={1.8} aria-hidden="true" />
      <span className="theme-switcher__label">Theme</span>
      <select value={preference} onChange={handleChange}>
        <option value="system">System</option>
        <option value="light">Light</option>
        <option value="dark">Dark</option>
      </select>
    </label>
  )
}
