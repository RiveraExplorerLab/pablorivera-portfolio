import { motion, useReducedMotion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function About() {
  const reduce = useReducedMotion()
  const appear = reduce ? {} : { opacity: 1, y: 0 }

  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={appear}
          transition={{ duration: 0.2 }}
          className="text-4xl md:text-5xl font-bold tracking-tight"
        >
          About Pablo
        </motion.h1>

        <p className="text-neutral-300 max-w-2xl">
          I'm a systems thinker who builds small, sharp tools. I help teams
          turn messy processes into clean, dependable flows—fast feedback loops,
          simple UIs, and pragmatic automation.
        </p>

        <div className="flex gap-3">
          <Link
            to="/projects"
            className="inline-flex items-center rounded-lg bg-white text-black px-4 py-2 text-sm font-medium hover:bg-neutral-200 transition focus-visible:outline-none focus-visible:ring-2"
          >
            View projects
          </Link>
          <a
            href="mailto:hello@pablorivera.dev"
            className="inline-flex items-center rounded-lg border border-neutral-700 px-4 py-2 text-sm font-medium hover:bg-neutral-900 transition focus-visible:outline-none focus-visible:ring-2"
          >
            Contact
          </a>
        </div>
      </section>

      {/* I HELP WITH */}
      <section aria-labelledby="help-title" className="space-y-4">
        <h2 id="help-title" className="text-2xl font-semibold">I help with</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {[
            'Designing simple web apps that remove friction.',
            'Turning vague requirements into crisp flows and copy.',
            'Automating manual steps with pragmatic tools.',
            'Shipping small, iterating quickly, documenting decisions.',
          ].map((item) => (
            <li
              key={item}
              className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4 text-sm text-neutral-300"
            >
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* VALUES */}
      <section aria-labelledby="values-title" className="space-y-4">
        <h2 id="values-title" className="text-2xl font-semibold">Values</h2>
        <div className="grid gap-3 md:grid-cols-3">
          <ValueCard title="Clarity over cleverness">
            Plain language beats jargon. If it's hard to explain, it's not ready.
          </ValueCard>
          <ValueCard title="Tight feedback loops">
            Ship small, learn fast. Demos &gt; decks.
          </ValueCard>
          <ValueCard title="Kind candor">
            Be direct and helpful. Challenge ideas, not people.
          </ValueCard>
        </div>
      </section>

      {/* TIMELINE / SNAPSHOTS */}
      <section aria-labelledby="timeline-title" className="space-y-4">
        <h2 id="timeline-title" className="text-2xl font-semibold">Snapshots</h2>
        <ul className="space-y-3">
          <TimelineItem when="2025" what="Explorer Lab (personal)">
            Building a portfolio + small apps that teach by doing.
          </TimelineItem>
          <TimelineItem when="2023-2024" what="Power Platform + Web">
            Helped teams turn paper processes into reliable apps/flows.
          </TimelineItem>
          <TimelineItem when="Earlier" what="Systems thinking">
            Learned to map problems, constrain scope, and name trade-offs.
          </TimelineItem>
        </ul>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
        <h2 className="text-xl font-semibold">Let`s improve something small</h2>
        <p className="text-neutral-300 mt-1 text-sm">
          Have a clunky workflow or a tiny app idea? I like problems that fit in a one-page brief.
        </p>
        <div className="mt-3 flex flex-wrap gap-3">
          <Link to="/projects" className="underline text-sm">See projects</Link>
          <a href="mailto:hello@pablorivera.dev" className="underline text-sm">Email me</a>
        </div>
      </section>
    </div>
  )
}

function ValueCard({ title, children }: { title: string; children: React.ReactNode }) {
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

function TimelineItem({
  when, what, children,
}: { when: string; what: string; children: React.ReactNode }) {
  return (
    <li className="rounded-lg border border-neutral-800 bg-neutral-900/40 p-4">
      <div className="flex items-baseline gap-3">
        <span className="text-xs uppercase tracking-wide text-neutral-400">{when}</span>
        <span className="font-medium">{what}</span>
      </div>
      <p className="text-sm text-neutral-300 mt-1">{children}</p>
    </li>
  )
}