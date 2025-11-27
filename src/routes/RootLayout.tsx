import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'

export default function RootLayout() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Close the mobile menu on route change
  useEffect(() => { setOpen(false) }, [location.pathname])

  // Shadow when scrolled
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links: Array<[to: string, label: string]> = [
    ['/', 'Home'],
    ['/about', 'About'],
    ['/projects', 'Projects'],
    ['/stack', 'Stack'],
    ['/blog', 'Blog'],
    ['/community', 'Community']
  ]

  return (
    <div className="min-h-dvh flex flex-col relative">
      {/* Animated background blobs */}
      <div className="blob-bg" aria-hidden>
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      {/* Skip link */}
      <a href="#main" className="sr-only focus:not-sr-only focus:p-2">Skip to content</a>

      {/* STICKY HEADER */}
      <header
        data-scrolled={scrolled}
        className="
          sticky top-0 z-50
          border-b border-white/10
          backdrop-blur-2xl
          transition-all duration-300
          data-[scrolled=true]:shadow-[0_1px_0_0_rgba(255,255,255,0.06)]
        "
        style={{
          background: scrolled ? 'rgba(2, 6, 23, 0.8)' : 'rgba(2, 6, 23, 0.6)',
        }}
      >
        <div className="mx-auto max-w-5xl px-4">
          <nav className="py-3 flex items-center justify-between">
            {/* Brand */}
            <div className="font-semibold tracking-tight gradient-text">
              Pablo Rivera
            </div>

            {/* Desktop nav */}
            <ul className="hidden md:flex gap-1 text-sm">
              {links.map(([to, label]) => (
                <li key={to}>
                  <NavLink
                    to={to}
                    end={to === '/'}
                    className={({ isActive }) =>
                      [
                        'px-3 py-1.5 rounded-lg transition-all duration-300',
                        'focus:outline-none focus:ring-2 focus:ring-teal-500/60',
                        isActive
                          ? 'bg-white/10 text-stone-100 border border-white/20'
                          : 'text-stone-300 hover:text-stone-100 hover:bg-white/5 border border-transparent'
                      ].join(' ')
                    }
                  >
                    {label}
                  </NavLink>
                </li>
              ))}
            </ul>

            {/* Mobile toggle */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center rounded-lg px-2 py-1 text-stone-300 hover:text-stone-100 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-teal-500/60 transition-all duration-300"
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen(v => !v)}
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6" aria-hidden="true">
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                ) : (
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                )}
              </svg>
            </button>
          </nav>

          {/* Mobile dropdown */}
          {open && (
            <div className="md:hidden pb-3">
              <ul className="flex flex-col gap-1 text-sm">
                {links.map(([to, label]) => (
                  <li key={to}>
                    <NavLink
                      to={to}
                      end={to === '/'}
                      className={({ isActive }) =>
                        [
                          'block w-full px-3 py-2 rounded-lg transition-all duration-300',
                          'focus:outline-none focus:ring-2 focus:ring-teal-500/60',
                          isActive
                            ? 'bg-white/10 text-stone-100 border border-white/20'
                            : 'text-stone-300 hover:text-stone-100 hover:bg-white/5 border border-transparent'
                        ].join(' ')
                      }
                    >
                      {label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </header>

      {/* MAIN */}
      <main id="main" className="flex-1 mx-auto max-w-5xl px-4 py-10 text-stone-200 relative z-10">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-white/10 backdrop-blur-xl relative z-10" style={{ background: 'rgba(2, 6, 23, 0.6)' }}>
        <div className="mx-auto max-w-5xl px-4 py-8 text-sm text-stone-400 flex items-center justify-between">
          <span>© {new Date().getFullYear()} Pablo Rivera</span>
          <span className="text-stone-500">
          </span>
        </div>
      </footer>
    </div>
  )
}