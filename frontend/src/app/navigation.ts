import {
  FileText,
  History,
  LayoutDashboard,
  Send,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface NavigationItem {
  label: string
  to: string
  icon: LucideIcon
}

export const navigationItems = [
  { label: 'Dashboard', to: '/', icon: LayoutDashboard },
  { label: 'Recipients', to: '/recipients', icon: Users },
  { label: 'Templates', to: '/templates', icon: FileText },
  { label: 'Compose', to: '/compose', icon: Send },
  { label: 'History', to: '/history', icon: History },
] satisfies NavigationItem[]
