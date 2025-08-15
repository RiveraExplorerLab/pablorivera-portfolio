import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { stack as groups } from '../data/stack'

export default function Stack() {
  const [q, setQ] = useState('')

  // filter by name or role
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

  // ESC to clear search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setQ('') }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <header className="space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-stone-100 flex items-center gap-2">
          <span className="inline-block size-2 rounded-full bg-emerald-400" />
          Stack
        </h1>
        <p className="text-stone-300 max-w-2xl">
          Tools I reach for first — short blurbs, no vendor-speak.
        </p>

        <div className="mt-2">
          <label className="sr-only" htmlFor="stack-search">Filter tools</label>
          <div className="relative w-full max-w-md">
            <input
              id="stack-search"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Filter by name or purpose…"
              className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 pr-8 text-sm text-stone-100
                         placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
            />
            {q && (
              <button
                type="button"
                onClick={() => setQ('')}
                className="absolute inset-y-0 right-1 my-auto h-7 w-7 rounded hover:bg-stone-800
                           text-stone-400 hover:text-stone-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
                aria-label="Clear search"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </header>

      {/* GROUPS */}
      <div className="space-y-8">
        {filtered.map((group, i) => (
          <section key={group.title} aria-labelledby={`group-${i}`} className="space-y-3">
            <h2 id={`group-${i}`} className="text-xl font-semibold text-stone-100 flex items-center gap-2">
              <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
              {group.title}
            </h2>

            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool, j) => (
                <motion.li
                  key={tool.name}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.18, delay: j * 0.02 }}
                  className="rounded-xl border border-stone-800 bg-stone-900/40 p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-medium text-stone-100">{tool.name}</div>

                    {tool.link && (
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-stone-300 hover:text-stone-100 underline decoration-emerald-500/50 underline-offset-4
                                   focus:outline-none focus:ring-2 focus:ring-emerald-500/60 rounded px-1"
                        aria-label={`Open ${tool.name} website`}
                        onClick={(e) => e.stopPropagation()}
                      >
                        site
                      </a>
                    )}
                  </div>

                  <p className="mt-1 text-sm text-stone-300">{tool.role}</p>

                  {!!tool.tags?.length && (
                    <ul className="mt-2 flex flex-wrap gap-2">
                      {tool.tags.map((t: string) => (
                        <li
                          key={t}
                          className="text-[11px] px-2 py-0.5 rounded-full border border-stone-700 text-stone-200 bg-stone-900/60
                                     hover:border-emerald-500/50"
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
          <p className="text-stone-400 text-sm">No matches. Try a different search.</p>
        )}
      </div>
    </div>
  )
}