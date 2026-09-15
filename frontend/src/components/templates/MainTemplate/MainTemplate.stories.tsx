import type { Meta, StoryObj } from '@storybook/react-vite'
import { MemoryRouter, Route, Routes } from 'react-router'

import { DashboardPage } from '../../../pages/DashboardPage'
import { MainTemplate } from './MainTemplate'

const meta = {
  title: 'Templates/MainTemplate',
  component: MainTemplate,
  parameters: { layout: 'fullscreen' },
  render: () => (
    <MemoryRouter>
      <Routes>
        <Route element={<MainTemplate />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Routes>
    </MemoryRouter>
  ),
} satisfies Meta<typeof MainTemplate>

export default meta
type Story = StoryObj<typeof meta>

export const Dashboard: Story = {}
