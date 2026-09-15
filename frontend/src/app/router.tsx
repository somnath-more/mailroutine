import { createBrowserRouter, Navigate } from 'react-router'

import { MainTemplate } from '../components/templates/MainTemplate/MainTemplate'
import { ComposePage } from '../pages/ComposePage'
import { DashboardPage } from '../pages/DashboardPage'
import { HistoryPage } from '../pages/HistoryPage'
import { RecipientsPage } from '../pages/RecipientsPage'
import { TemplatesPage } from '../pages/TemplatesPage'

export const router = createBrowserRouter([
  {
    element: <MainTemplate />,
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'recipients', element: <RecipientsPage /> },
      { path: 'templates', element: <TemplatesPage /> },
      { path: 'compose', element: <ComposePage /> },
      { path: 'history', element: <HistoryPage /> },
      { path: '*', element: <Navigate replace to="/" /> },
    ],
  },
])
