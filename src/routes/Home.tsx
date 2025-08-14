import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { projects } from '../data/projects'

export default function Home() {
  const featured = projects[0] // simplest: feature your first project

  return (
    <div className="space-y-14">
      {/* HERO */}
      <section className="pt-4">
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="text-4xl md:text-5xl font-bold tracking-tight"
          >
            Systems thinker. Builder. <span className="text-neutral-400">I design simple flows for complex problems.</span>
          </motion.h1>

          <p className="text-neutral-300 max-w-2xl">
            I help teams turn ambiguous processes into clean, reliable tools — from quick web apps to Power Platform workflows.
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/projects"
              className="inline-flex items-center rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-neutral-200 transition"
            >
              View projects
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-900 transition"
            >
              About me
            </Link>
          </div>
        </div>
      </section>

      {/* HIGHLIGHTS */}
      <section aria-label="Highlights" className="grid gap-4 sm:grid-cols-3">
        <Card title="Value">
          Clear systems, fast feedback loops, and small elegant interfaces.
        </Card>
        <Card title="Capabilities">
          React, TypeScript, Tailwind, Framer Motion. Power Platform for pragmatic automations.
        </Card>
        <Card title="Now building">
          Portfolio + Explorer Lab. Shipping small, finishing strong.
        </Card>
      </section>

      {/* FEATURED PROJECT */}
      {featured && (
        <section aria-label="Featured project">
          <div className="flex items-start gap-5">
            <div className="w-32 h-20 rounded-md overflow-hidden bg-neutral-800 shrink-0">
              {featured.cover && (
                <img
                  src={featured.cover}
                  alt={`${featured.name} cover`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              )}
            </div>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold">{featured.name}</h2>
              <p className="text-neutral-300 text-sm mt-1">{featured.oneLiner}</p>
              <div className="mt-3 flex gap-4 text-sm">
                <Link className="underline" to="/projects">All projects</Link>
                {featured.links?.live && (
                  <a className="underline" href={featured.links.live} target="_blank" rel="noreferrer">
                    View live
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
      className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4"
    >
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-neutral-300 mt-1">{children}</p>
    </motion.article>
  )
}