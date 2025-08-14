import { useMemo, useState } from 'react'
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
        )
      }))
      .filter(g => g.tools.length > 0)
  }, [q])

  return (
    <div className="space-y-8">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">Stack</h1>
        <p className="text-neutral-300 max-w-2xl">
          Tools I reach for first, and why. Short blurbs, no vendor-speak.
        </p>

        <div className="mt-2">
          <label className="sr-only" htmlFor="stack-search">Filter tools</label>
          <input
            id="stack-search"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Filter by name or purpose…"
            className="w-full max-w-md rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm
                       focus-visible:outline-none focus-visible:ring-2"
          />
        </div>
      </header>

      <div className="space-y-6">
        {filtered.map((group, i) => (
          <section key={group.title} aria-labelledby={`group-${i}`} className="space-y-3">
            <h2 id={`group-${i}`} className="text-xl font-semibold">{group.title}</h2>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.tools.map((tool, j) => (
                <motion.li
                  key={tool.name}
                  initial={{ opacity: 0, y: 6 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.18, delay: j * 0.02 }}
                  className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="font-medium">{tool.name}</div>
                    {tool.link && (
                      <a
                        href={tool.link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs underline"
                        aria-label={`Open ${tool.name} website`}
                      >
                        site
                      </a>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-neutral-300">{tool.role}</p>
                </motion.li>
              ))}
            </ul>
          </section>
        ))}

        {filtered.length === 0 && (
          <p className="text-neutral-400 text-sm">No matches. Try a different search.</p>
        )}
      </div>
    </div>
  )
}