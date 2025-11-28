// src/routes/Stack.tsx
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { stack as groups } from '../data/stack'

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

  // Total tool count
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
    <div className="space-y-8">
      {/* HEADER */}
      <header className="space-y-4">
        <motion.h1 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 flex items-center gap-3"
        >
          <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
          Stack
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="text-stone-400 max-w-2xl"
        >
          Tools I reach for first — short blurbs, no vendor-speak. 
          <span className="text-stone-500 ml-1">({totalTools} tools across {groups.length} categories)</span>
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="relative w-full max-w-md"
        >
          <label className="sr-only" htmlFor="stack-search">Filter tools</label>
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-stone-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                         text-stone-400 hover:text-stone-200 focus:outline-none focus:ring-2 focus:ring-teal-500/60 transition-all
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

      {/* GROUPS */}
      <div className="space-y-10">
        {filtered.map((group, gi) => (
          <section key={group.title} aria-labelledby={`group-${gi}`} className="space-y-4">
            <h2 id={`group-${gi}`} className="text-lg font-semibold text-stone-100 flex items-center gap-2">
              <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
              {group.title}
              <span className="text-xs text-stone-500 font-normal ml-1">
                ({group.tools.length})
              </span>
            </h2>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool, ti) => (
                <motion.li
                  key={tool.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.2, delay: ti * 0.02 }}
                  className="card p-4 group hover:border-teal-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/10 flex items-center justify-center text-teal-400 text-sm font-bold border border-teal-500/20">
                        {tool.name.charAt(0)}
                      </div>
                      <div className="font-medium text-stone-100 group-hover:text-teal-300 transition-colors">
                        {tool.name}
                      </div>
                    </div>

                    {tool.link && (
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-stone-500 hover:text-teal-400 transition-colors p-1 rounded hover:bg-white/5"
                        aria-label={`Open ${tool.name} website`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-stone-400">{tool.role}</p>

                  {!!tool.tags?.length && (
                    <ul className="mt-3 flex flex-wrap gap-1.5">
                      {tool.tags.map((t: string) => (
                        <li
                          key={t}
                          className="text-[10px] px-2 py-0.5 rounded-full glass text-stone-500"
                        >
                          {t}
                        </li>
                      ))}
                    </ul>
                  )}
                </motion.li>
              ))}
            </ul>
          </section>
        ))}

        {filtered.length === 0 && (
          <div className="card p-8 text-center">
            <p className="text-stone-400">No matches found.</p>
            <button
              onClick={() => setQ('')}
              className="text-sm text-teal-400 hover:text-teal-300 mt-2"
            >
              Clear search
            </button>
          </div>
        )}
      </div>

      {/* CTA */}
      <section className="card p-6 text-center">
        <h2 className="text-lg font-semibold text-stone-100">Curious about a project?</h2>
        <p className="text-stone-400 text-sm mt-1">
          See how I put these tools to work.
        </p>
        <div className="mt-4">
          <a href="/projects" className="btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            View Projects
          </a>
        </div>
      </section>
    </div>
  )
}
