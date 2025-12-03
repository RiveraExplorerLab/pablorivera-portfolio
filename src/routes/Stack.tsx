// src/routes/Stack.tsx
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { stack as groups } from '../data/stack'
import SEO from '../components/SEO'

// Category icons and colors
const categoryConfig: Record<string, { icon: JSX.Element; color: string; bg: string; border: string }> = {
  'Frontend': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
    color: 'text-[#f0b429]',
    bg: 'from-[#f0b429]/20 to-[#fbbf24]/10',
    border: 'border-[#f0b429]/20'
  },
  'Backend': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />,
    color: 'text-purple-400',
    bg: 'from-purple-500/20 to-purple-600/10',
    border: 'border-purple-500/20'
  },
  'Database': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />,
    color: 'text-cyan-400',
    bg: 'from-cyan-500/20 to-cyan-600/10',
    border: 'border-cyan-500/20'
  },
  'DevOps': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />,
    color: 'text-emerald-400',
    bg: 'from-emerald-500/20 to-emerald-600/10',
    border: 'border-emerald-500/20'
  },
  'Design': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />,
    color: 'text-pink-400',
    bg: 'from-pink-500/20 to-pink-600/10',
    border: 'border-pink-500/20'
  },
  'Productivity': {
    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />,
    color: 'text-amber-400',
    bg: 'from-amber-500/20 to-amber-600/10',
    border: 'border-amber-500/20'
  },
}

// Default config for uncategorized
const defaultConfig = {
  icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />,
  color: 'text-[#f0b429]',
  bg: 'from-[#f0b429]/20 to-[#fbbf24]/10',
  border: 'border-[#f0b429]/20'
}

export default function Stack() {
  const [q, setQ] = useState('')

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    if (!term) return groups
    return groups
      .map(g => ({
        ...g,
        tools: g.tools.filter(t =>
          t.name.toLowerCase().includes(term) ||
          t.role.toLowerCase().includes(term)
        ),
      }))
      .filter(g => g.tools.length > 0)
  }, [q])

  // Stats
  const totalTools = useMemo(() => 
    groups.reduce((acc, g) => acc + g.tools.length, 0), 
    []
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setQ('') }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <SEO 
        title="Stack" 
        description="The tools Pablo Rivera reaches for first — from React and TypeScript to Firebase and Tailwind. Short blurbs, no vendor-speak."
      />
      <div className="space-y-12">
      {/* HEADER */}
      <header className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#e8e6f0]">
              My Stack
            </h1>
            <p className="text-[#9d99a9] mt-2 max-w-xl">
              Tools I reach for first — short blurbs, no vendor-speak.
            </p>
          </div>
          
          {/* Quick stats */}
          <div className="flex gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#e8e6f0]">{totalTools}</div>
              <div className="text-xs text-[#9d99a9]">Tools</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-[#e8e6f0]">{groups.length}</div>
              <div className="text-xs text-[#9d99a9]">Categories</div>
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="relative w-full max-w-md"
        >
          <label className="sr-only" htmlFor="stack-search">Filter tools</label>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-[#9d99a9]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            id="stack-search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Filter by name or purpose…"
            className="input pl-10 pr-10"
          />
          {q && (
            <button
              type="button"
              onClick={() => setQ('')}
              className="absolute inset-y-0 right-2 my-auto h-7 w-7 rounded-lg hover:bg-white/10
                         text-[#9d99a9] hover:text-[#e8e6f0] focus:outline-none focus:ring-2 focus:ring-[#f0b429]/60 transition-all
                         flex items-center justify-center"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </motion.div>
      </header>

      {/* CATEGORY ZONES */}
      <div className="space-y-16">
        {filtered.map((group, gi) => {
          const config = categoryConfig[group.title] || defaultConfig
          
          return (
            <section key={group.title} aria-labelledby={`group-${gi}`} className="space-y-6">
              {/* Category header with icon */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-4"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.bg} border ${config.border} flex items-center justify-center`}>
                  <svg className={`w-6 h-6 ${config.color}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {config.icon}
                  </svg>
                </div>
                <div>
                  <h2 id={`group-${gi}`} className="text-xl font-semibold text-[#e8e6f0]">
                    {group.title}
                  </h2>
                  <p className="text-sm text-[#9d99a9]">
                    {group.tools.length} tool{group.tools.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </motion.div>

              {/* Tools grid */}
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.tools.map((tool, ti) => (
                  <motion.li
                    key={tool.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.2, delay: ti * 0.03 }}
                    className="card p-4 group hover:border-[#f0b429]/30 transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.bg} flex items-center justify-center ${config.color} text-sm font-bold border ${config.border} group-hover:scale-110 transition-transform`}>
                          {tool.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-medium text-[#e8e6f0] group-hover:text-[#f0b429] transition-colors">
                            {tool.name}
                          </div>
                          {!!tool.tags?.length && (
                            <div className="flex flex-wrap gap-1 mt-0.5">
                              {tool.tags.slice(0, 2).map((t: string) => (
                                <span
                                  key={t}
                                  className="text-[10px] text-[#9d99a9]/60"
                                >
                                  {t}{tool.tags && tool.tags.indexOf(t) < Math.min(tool.tags.length - 1, 1) ? ' · ' : ''}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {tool.link && (
                        <a
                          href={tool.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[#9d99a9] hover:text-[#f0b429] transition-colors p-1.5 rounded-lg hover:bg-white/5 opacity-0 group-hover:opacity-100"
                          aria-label={`Open ${tool.name} website`}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                    </div>

                    <p className="mt-3 text-sm text-[#9d99a9] leading-relaxed">{tool.role}</p>
                  </motion.li>
                ))}
              </ul>
            </section>
          )
        })}

        {filtered.length === 0 && (
          <div className="card p-12 text-center">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-[#e8e6f0] font-medium">No matches found</p>
            <p className="text-[#9d99a9] text-sm mt-1">Try a different search term</p>
            <button
              onClick={() => setQ('')}
              className="text-sm text-[#f0b429] hover:text-[#fbbf24] mt-4 inline-flex items-center gap-1"
            >
              Clear search
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="card p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0b429]/5 to-transparent" />
        <div className="relative">
          <h2 className="text-xl font-semibold text-[#e8e6f0]">See these tools in action</h2>
          <p className="text-[#9d99a9] mt-2 max-w-md mx-auto">
            Check out my projects to see how I put this stack to work.
          </p>
          <div className="mt-5">
            <a href="/projects" className="btn-primary">
              View Projects
            </a>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}
