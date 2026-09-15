import type { Meta, StoryObj } from '@storybook/react-vite'

import { Header } from './Header'

const meta = {
  title: 'Organisms/Header',
  component: Header,
  parameters: { layout: 'fullscreen' },
  args: {
    isNavigationOpen: false,
    onNavigationToggle: () => undefined,
  },
} satisfies Meta<typeof Header>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
export const NavigationOpen: Story = { args: { isNavigationOpen: true } }
