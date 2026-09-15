import { NavLink } from 'react-router'

export function Brand() {
  return (
    <NavLink className="brand" to="/" aria-label="Careerflow dashboard">
      <span className="brand__mark" aria-hidden="true">
        C
      </span>
      <span className="brand__name">Careerflow</span>
    </NavLink>
  )
}
