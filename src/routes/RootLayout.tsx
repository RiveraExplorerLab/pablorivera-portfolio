import { NavLink, Outlet } from 'react-router-dom'

export default function RootLayout() {
  return (
    <div className="min-h-dvh flex flex-col">
      {/* Skip link for keyboard users */}
      <a href="#main" className="sr-only focus:not-sr-only focus:p-2">
        Skip to content
      </a>

      <header className="border-b">
        <nav className="mx-auto max-w-5xl px-4 py-3 flex items-center gap-6">
          <div className="font-semibold">Pablo Rivera</div>
          <ul className="flex gap-4 text-sm">
            {[
              ['/', 'Home'],
              ['/about', 'About'],
              ['/projects', 'Projects'],
              ['/stack', 'Stack'],
              ['/blog', 'Blog'],
              ['/community', 'Community'],
            ].map(([to, label]) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `px-2 py-1 rounded ${
                      isActive ? 'bg-neutral-800' : 'hover:bg-neutral-900'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main id="main" className="flex-1 mx-auto max-w-5xl px-4 py-10">
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-5xl px-4 py-6 text-sm text-neutral-400">
          © {new Date().getFullYear()} Pablo Rivera
        </div>
      </footer>
    </div>
  )
}