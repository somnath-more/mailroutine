import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router'

export interface NavItemProps {
  icon: LucideIcon
  label: string
  to: string
  onNavigate?: () => void
}

export function NavItem({ icon: Icon, label, to, onNavigate }: NavItemProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        `nav-item${isActive ? ' nav-item--active' : ''}`
      }
      end={to === '/'}
      to={to}
      onClick={onNavigate}
    >
      <Icon className="nav-item__icon" size={19} strokeWidth={1.8} />
      <span>{label}</span>
    </NavLink>
  )
}
