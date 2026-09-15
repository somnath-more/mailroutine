import { Menu, X } from 'lucide-react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { IconButton } from './IconButton'

const meta = {
  title: 'Atoms/IconButton',
  component: IconButton,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof IconButton>

export default meta
type Story = StoryObj<typeof meta>

export const MenuControl: Story = {
  args: { label: 'Open navigation', children: <Menu size={20} /> },
}

export const CloseControl: Story = {
  args: { label: 'Close navigation', children: <X size={20} /> },
}
