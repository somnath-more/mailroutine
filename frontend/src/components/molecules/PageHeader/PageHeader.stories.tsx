import type { Meta, StoryObj } from '@storybook/react-vite'

import { PageHeader } from './PageHeader'

const meta = {
  title: 'Molecules/PageHeader',
  component: PageHeader,
  args: {
    eyebrow: 'Email workspace',
    title: 'Recipients',
    description: 'Import, review, and select the people you want to contact.',
  },
} satisfies Meta<typeof PageHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
