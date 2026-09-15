import { Users } from 'lucide-react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { NavItem } from './NavItem'

const meta = {
  title: 'Molecules/NavItem',
  component: NavItem,
  parameters: { layout: 'centered' },
  args: { icon: Users, label: 'Recipients', to: '/recipients' },
} satisfies Meta<typeof NavItem>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
