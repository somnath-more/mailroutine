import type { Meta, StoryObj } from '@storybook/react-vite'

import { Brand } from './Brand'

const meta = {
  title: 'Atoms/Brand',
  component: Brand,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof Brand>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
