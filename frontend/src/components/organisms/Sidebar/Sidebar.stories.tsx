import type { Meta, StoryObj } from '@storybook/react-vite'

import { Sidebar } from './Sidebar'

const meta = {
  title: 'Organisms/Sidebar',
  component: Sidebar,
  parameters: { layout: 'fullscreen' },
  args: { isOpen: true, onClose: () => undefined },
} satisfies Meta<typeof Sidebar>

export default meta
type Story = StoryObj<typeof meta>

export const Open: Story = {}
export const Closed: Story = { args: { isOpen: false } }
