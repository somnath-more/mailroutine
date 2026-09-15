import { Menu, X } from 'lucide-react'

import { IconButton } from '../../atoms/IconButton/IconButton'
import { ThemeSwitcher } from '../../molecules/ThemeSwitcher/ThemeSwitcher'

export interface HeaderProps {
  isNavigationOpen: boolean
  onNavigationToggle: () => void
}

export function Header({ isNavigationOpen, onNavigationToggle }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__identity">
        <IconButton
          className="app-header__menu"
          label={isNavigationOpen ? 'Close navigation' : 'Open navigation'}
          aria-controls="primary-sidebar"
          aria-expanded={isNavigationOpen}
          onClick={onNavigationToggle}
        >
          {isNavigationOpen ? <X size={20} /> : <Menu size={20} />}
        </IconButton>
        <div>
          <p className="app-header__title">Careerflow workspace</p>
          <p className="app-header__context">Email operations</p>
        </div>
      </div>
      <ThemeSwitcher />
    </header>
  )
}
