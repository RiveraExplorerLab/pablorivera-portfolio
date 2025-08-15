// src/routes/Projects.tsx
import { motion } from 'framer-motion'
import { useProjects } from '../lib/useSupabase'
import { Link } from 'react-router-dom'

export default function Projects() {
  const { data: projects, loading, error } = useProjects()

  if (loading) return <p className="text-stone-400 text-sm">Loading projects…</p>
  if (error) return <p className="text-rose-400 text-sm">Error: {error}</p>

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-stone-100">Projects</h1>
        <p className="text-stone-300">A running log of what I’ve been building.</p>
      </header>

      <ul className="grid gap-4 sm:grid-cols-2">
        {projects?.map((p: any, i: number) => (
          <motion.li
            key={p.id}
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.2, delay: i * 0.03 }}
            className="rounded-xl border border-stone-800 bg-stone-900/40 p-4"
          >
            <div className="flex gap-3">
              <div className="w-24 h-16 rounded-md overflow-hidden bg-stone-800 shrink-0">
                {p.cover_url && (
                  <img
                    src={p.cover_url}
                    alt={`${p.name} cover`}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-stone-100">
  <Link to={`/projects/${p.slug}`} className="hover:underline">
    {p.name}
  </Link>
</h2>
                {p.one_liner && (
                  <p className="text-sm text-stone-300 mt-1">{p.one_liner}</p>
                )}
                {p.links?.live && (
                  <a
                    href={p.links.live}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 underline underline-offset-2 text-sm mt-2 block"
                  >
                    Try it Live
                  </a>
                )}
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}