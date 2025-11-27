// src/routes/Home.tsx
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useFeaturedProjects, useProjects } from '../hooks/useProjects'
import type { Project } from '../lib/types'

export default function Home() {
  const { data: featuredProjects } = useFeaturedProjects(1)
  const { data: allProjects } = useProjects()
  
  // Get the featured project, or fallback to first project
  const featured: Project | null = featuredProjects?.[0] || allProjects?.[0] || null
  
  const prefersReducedMotion = useReducedMotion()

  const phrases = [
    "Designing systems with personality",
    "Learning through every build",
    "Shaping ideas into working tools"
  ] as const

  const typed = useTypewriter(phrases, { typeMs: 55, deleteMs: 35, holdMs: 1100 })

  return (
    <div className="space-y-14">
      {/* HERO */}
      <section className="pt-4">
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100"
          >
            I&apos;m <span className="text-emerald-400">Pablo</span>.
            <span className="block text-stone-400" aria-live="polite" aria-atomic="true">
              {typed}
              {!prefersReducedMotion && (
                <motion.span
                  className="inline-block w-[0.6ch] align-baseline text-emerald-400"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                >
                  |
                </motion.span>
              )}
            </span>
          </motion.h1>

          <p className="text-stone-300 max-w-2xl">
            I approach software like an artist approaches a canvas — exploring, experimenting,
            and refining until tools feel as intuitive as they are capable.
            Every build is a chance to learn, and every feature is a brushstroke in how I solve problems.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/about"
              className="inline-flex items-center rounded-lg bg-emerald-400 text-black px-4 py-2 text-sm font-medium hover:bg-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
            >
              About Me
            </Link>
            <Link
              to="/community"
              className="inline-flex items-center rounded-lg border border-stone-700 px-4 py-2 text-sm font-medium text-stone-200 hover:border-emerald-500/50 hover:bg-stone-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
            >
              Community
            </Link>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section aria-label="Principles" className="grid gap-4 sm:grid-cols-3">
        <Card title="Dissect to Understand">
          I take systems and workflows apart to see how they really move, then rebuild them so the people using them move faster.
        </Card>
        <Card title="Make It Feel Obvious">
          Tools should lower cognitive load. Clear defaults, fewer clicks, and interfaces that explain themselves.
        </Card>
        <Card title="Prototype to Learn">
          I start simple, test early, and let real feedback shape the next iteration.
        </Card>
      </section>

      {/* FEATURED BUILD */}
      {featured && (
        <section aria-label="Featured build">
          <div className="flex items-start gap-5">
            <div className="w-32 h-20 rounded-md overflow-hidden bg-stone-800 shrink-0">
              {featured.coverImage && (
                <img
                  src={featured.coverImage}
                  alt={`${featured.title} cover`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold text-stone-100">{featured.title}</h2>
              <p className="text-stone-300 text-sm mt-1">
                {featured.summary}
              </p>
              <div className="mt-3 flex gap-4 text-sm">
                <Link
                  className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400"
                  to="/projects"
                >
                  All Builds
                </Link>
                {featured.liveUrl && (
                  <a
                    className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400"
                    href={featured.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Try it Live
                  </a>
                )}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.18 }}
      className="rounded-xl border border-stone-800 bg-stone-900/40 p-4"
    >
      <h3 className="font-semibold text-stone-100 flex items-center gap-2">
        <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
        {title}
      </h3>
      <p className="text-sm text-stone-300 mt-1">{children}</p>
    </motion.article>
  )
}

function useTypewriter(
  words: readonly string[],
  opts?: { typeMs?: number; deleteMs?: number; holdMs?: number }
) {
  const typeMs = opts?.typeMs ?? 70
  const deleteMs = opts?.deleteMs ?? 40
  const holdMs = opts?.holdMs ?? 1200
  const [i, setI] = useState(0)
  const [sub, setSub] = useState(0)
  const [del, setDel] = useState(false)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current)
    const current = words[i]
    let delay = del ? deleteMs : typeMs

    if (!del && sub === current.length) {
      delay = holdMs
      timer.current = window.setTimeout(() => setDel(true), delay)
      return
    }
    if (del && sub === 0) {
      setDel(false)
      setI((p) => (p + 1) % words.length)
      return
    }
    timer.current = window.setTimeout(() => setSub((p) => p + (del ? -1 : 1)), delay)
    return () => { if (timer.current) window.clearTimeout(timer.current) }
  }, [del, sub, i, words, typeMs, deleteMs, holdMs])

  return words[i].slice(0, sub)
}
