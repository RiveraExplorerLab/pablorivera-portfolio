import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState, useRef } from 'react'

export default function RootLayout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const menuRef = useRef<HTMLDivElement>(null)

  // Close the mobile menu on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  // Shadow when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [open])

  const links: Array<[to: string, label: string, icon: JSX.Element]> = [
    ['/', 'Home', <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path d="M9 22V12h6v10"/></svg>],
    ['/about', 'About', <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 4-6 8-6s8 2 8 6"/></svg>],
    ['/projects', 'Projects', <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>],
    ['/stack', 'Stack', <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>],
    ['/blog', 'Blog', <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"/><path d="M6 8h12M6 12h12M6 16h8"/></svg>],
    ['/community', 'Community', <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="9" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><path d="M3 18c0-3 3-5 6-5 1.5 0 2.9.5 4 1.3"/><path d="M14 18c0-3 3-5 6-5"/></svg>],
  ]

  return (
    <div className="min-h-dvh flex flex-col relative">
      {/* Ambient background */}
      <div className="ambient-bg" aria-hidden />
      <div className="noise-overlay" aria-hidden />

      {/* Skip link */}
      <a 
        href="#main" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#f0b429] focus:text-black focus:rounded-lg focus:font-medium"
      >
        Skip to content
      </a>

      {/* STICKY HEADER */}
      <header
        data-scrolled={scrolled}
        className="sticky top-0 z-50 border-b border-white/10 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(19, 17, 26, 0.95)' : 'rgba(19, 17, 26, 0.8)',
        }}
      >
        <div className="mx-auto max-w-5xl px-4 safe-area-inset">
          <nav className="h-14 flex items-center justify-between">
            {/* Brand */}
            <NavLink 
              to="/" 
              className="font-heading font-semibold tracking-tight gradient-text text-lg hover:opacity-80 transition-opacity min-h-[44px] flex items-center"
            >
              Pablo Rivera
            </NavLink>

            {/* Desktop nav */}
            <ul className="hidden md:flex gap-1 text-sm font-heading font-medium">
              {links.map(([to, label]) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      [
                        'px-3 py-2 rounded-lg transition-all duration-200 min-h-[44px] flex items-center',
                        'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0b429]/60',
                        isActive
                          ? 'bg-white/10 text-[#e8e6f0]'
                          : 'text-[#9d99a9] hover:text-[#e8e6f0] hover:bg-white/5'
                      ].join(' ')
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile toggle - 44x44 touch target */}
            <button
              type="button"
              className="md:hidden w-11 h-11 inline-flex items-center justify-center rounded-xl text-[#9d99a9] hover:text-[#e8e6f0] hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0b429]/60 transition-all duration-200 active:scale-95"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen(v => !v)}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                )}
              </svg>
            </button>
          </nav>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {open && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile drawer */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`
          fixed top-14 left-0 right-0 z-40 md:hidden
          transform transition-all duration-300 ease-out
          ${open ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0 pointer-events-none'}
        `}
        style={{ background: 'rgba(19, 17, 26, 0.98)' }}
      >
        <nav className="mx-auto max-w-5xl px-4 py-4 safe-area-inset">
          <ul className="flex flex-col gap-1">
            {links.map(([to, label, icon]) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    [
                      'flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all duration-200',
                      'min-h-[48px] text-base font-heading font-medium',
                      'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f0b429]/60',
                      'active:scale-[0.98]',
                      isActive
                        ? 'bg-[#f0b429]/10 text-[#f0b429] border border-[#f0b429]/20'
                        : 'text-[#9d99a9] hover:text-[#e8e6f0] hover:bg-white/5 border border-transparent'
                    ].join(' ')
                  }
                >
                  {icon}
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-white/10" />
      </div>

      {/* MAIN */}
      <main 
        id="main" 
        className="flex-1 mx-auto w-full max-w-5xl px-4 sm:px-6 py-8 sm:py-10 text-[#e8e6f0] relative z-10"
      >
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer 
        className="border-t border-white/10 relative z-10" 
        style={{ background: 'rgba(19, 17, 26, 0.95)' }}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 py-6 sm:py-8 safe-area-inset">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm">
            <div className="flex flex-col sm:flex-row items-center gap-2 text-[#9d99a9]">
              <span>© {new Date().getFullYear()} Pablo Rivera</span>
              <span className="hidden sm:inline text-[#9d99a9]/40">·</span>
              <span className="text-[#9d99a9]/60 text-xs">Made with ☕ and questionable sleep habits</span>
            </div>
            <div className="flex items-center gap-2">
              <a 
                href="https://github.com/pablomoreno" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#9d99a9] hover:text-[#f0b429] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="GitHub"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </a>
              <a 
                href="https://linkedin.com/in/pablomoreno" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#9d99a9] hover:text-[#f0b429] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="LinkedIn"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
              <a 
                href="mailto:hello@pablorivera.dev" 
                className="text-[#9d99a9] hover:text-[#f0b429] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                aria-label="Email"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="16" rx="2"/>
                  <path d="M22 6l-10 7L2 6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
