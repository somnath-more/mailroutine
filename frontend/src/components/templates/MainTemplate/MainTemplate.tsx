import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router'

import { Header } from '../../organisms/Header/Header'
import { Sidebar } from '../../organisms/Sidebar/Sidebar'

export function MainTemplate() {
  const [isNavigationOpen, setIsNavigationOpen] = useState(false)
  const location = useLocation()
  const [previousPathname, setPreviousPathname] = useState(location.pathname)

  if (location.pathname !== previousPathname) {
    setPreviousPathname(location.pathname)
    setIsNavigationOpen(false)
  }

  useEffect(() => {
    if (!isNavigationOpen) return

    const previousOverflow = document.body.style.overflow
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsNavigationOpen(false)
    }

    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isNavigationOpen])

  return (
    <div className="main-template">
      <a className="skip-link" href="#main-content">
        Skip to main content
      </a>
      <Sidebar
        isOpen={isNavigationOpen}
        onClose={() => setIsNavigationOpen(false)}
      />
      {isNavigationOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsNavigationOpen(false)}
        />
      )}
      <div className="main-template__body">
        <Header
          isNavigationOpen={isNavigationOpen}
          onNavigationToggle={() => setIsNavigationOpen((open) => !open)}
        />
        <main className="page-content" id="main-content" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
