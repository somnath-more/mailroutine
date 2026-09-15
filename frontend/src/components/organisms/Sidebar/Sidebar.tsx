import { X } from 'lucide-react'

import { navigationItems } from '../../../app/navigation'
import { Brand } from '../../atoms/Brand/Brand'
import { IconButton } from '../../atoms/IconButton/IconButton'
import { NavItem } from '../../molecules/NavItem/NavItem'

export interface SidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className="sidebar"
      id="primary-sidebar"
      data-open={isOpen}
      aria-label="Application sidebar"
    >
      <div className="sidebar__header">
        <Brand />
        <IconButton
          className="sidebar__close"
          label="Close navigation"
          onClick={onClose}
        >
          <X size={20} />
        </IconButton>
      </div>

      <nav className="sidebar__nav" aria-label="Primary navigation">
        {navigationItems.map((item) => (
          <NavItem key={item.to} {...item} onNavigate={onClose} />
        ))}
      </nav>

      <div className="sidebar__release-note">
        <span>Initial release</span>
        <strong>Import, review, and send</strong>
        <p>Focused email workflows first. Career tools follow later.</p>
      </div>
    </aside>
  )
}
