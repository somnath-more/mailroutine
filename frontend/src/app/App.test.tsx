import { render, screen } from '@testing-library/react'

import App from './App'

describe('App', () => {
  it('identifies Careerflow and the completed foundation', () => {
    render(<App />)

    expect(
      screen.getByRole('heading', { level: 1, name: 'Careerflow' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Project foundation is ready.')).toBeInTheDocument()
  })
})
