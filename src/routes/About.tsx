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
  className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100 flex items-center gap-3"
>
  <span className="inline-block size-2 rounded-full bg-emerald-400" />
  How I Think, How I Work
</motion.h1>

        <div className="space-y-4 text-stone-300 max-w-3xl">
          <p>
            I’m a systems thinker — but I’m not just here to map workflows or connect APIs.
            I build tools that surprise me, the kind that make me stop and think, 
            <span className="italic"> “Wait… this is actually good.”</span>
            Not just functional, but thoughtful. Not just clever, but clear.
          </p>
          <p>
            Every app, interaction, and idea is a lab experiment — where function meets delight
            and logic meets curiosity. I want my tools to reflect how people actually think,
            not just how data moves. I ask deep questions. I look for hidden constraints.
            I refactor not just the code, but the assumptions.
          </p>
          <p>
            Sometimes that means designing an internal order system with clean patch logic 
            and finance-ready audit trails. Sometimes it means a playful terminal prompt
            that hands you a joke and a tech stack suggestion.
          </p>
          <p>
            I don’t separate the playful from the purposeful — the best tools do both.
            For me, building is about discovering what’s possible when curiosity
            is given structure, and creating systems that help people grow — including me.
          </p>
        </div>

        <div className="flex gap-3">
          <Link
            to="/projects"
            className="inline-flex items-center rounded-lg bg-emerald-400 text-black px-4 py-2 text-sm font-medium hover:bg-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            View Projects
          </Link>
          <a
            href="mailto:hello@pablorivera.dev"
            className="inline-flex items-center rounded-lg border border-stone-700 px-4 py-2 text-sm font-medium text-stone-200 hover:border-emerald-500/50 hover:bg-stone-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            Contact
          </a>
        </div>
      </section>

      {/* VALUES */}
      <section aria-labelledby="values-title" className="space-y-4">
        <h2 id="values-title" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
          Core Values
        </h2>
        <div className="grid gap-3 md:grid-cols-3">
          <ValueCard title="Dissect to Understand">
            I take systems apart to see how they really move, then rebuild them so the people using them move faster.
          </ValueCard>
          <ValueCard title="Make It Feel Obvious">
            Tools should lower cognitive load. Clear defaults, fewer clicks, and interfaces that explain themselves.
          </ValueCard>
          <ValueCard title="Prototype to Learn">
            Ship the smallest useful version, gather feedback, and let reality shape the next iteration.
          </ValueCard>
        </div>
      </section>

      {/* BEYOND WORK */}
      <section aria-labelledby="beyond-title" className="space-y-4">
        <h2 id="beyond-title" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
          Beyond Work
        </h2>
        <p className="text-stone-300 max-w-2xl">
          I like taking things apart — code, cameras, old-school car parts — and figuring out how they fit back together.
          I shoot cinematic photos, play the piano, and dive into anime. I’m happiest when I’m learning,
          experimenting, or building something that didn’t exist yesterday.
        </p>
        <ul className="flex flex-wrap gap-2">
          {['Photography', 'Piano', 'Old-school cars', 'Anime', 'Science & discovery'].map((tag) => (
            <li
              key={tag}
              className="text-xs px-2.5 py-1 rounded-full border border-stone-700 text-stone-200 bg-stone-900/60 hover:border-emerald-500/50"
            >
              {tag}
            </li>
          ))}
        </ul>
      </section>

      {/* SNAPSHOTS */}
      <section aria-labelledby="timeline-title" className="space-y-4">
        <h2 id="timeline-title" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
          Snapshots
        </h2>
        <ul className="space-y-3">
          <TimelineItem when="2025" what="Exploring personal tools">
            Building a portfolio and side projects to explore the edges of what I can make.
          </TimelineItem>
          <TimelineItem when="2023–2024" what="Power Platform + Web">
            Turned messy paper processes into reliable apps and automations.
          </TimelineItem>
          <TimelineItem when="Earlier" what="Systems thinking">
            Learned to map problems, constrain scope, and name trade-offs.
          </TimelineItem>
        </ul>
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

function TimelineItem({
  when, what, children,
}: { when: string; what: string; children: React.ReactNode }) {
  return (
    <li className="rounded-lg border border-stone-800 bg-stone-900/40 p-4">
      <div className="flex items-baseline gap-3">
        <span className="text-xs uppercase tracking-wide text-stone-400">{when}</span>
        <span className="font-medium text-stone-100">{what}</span>
      </div>
      <p className="text-sm text-stone-300 mt-1">{children}</p>
    </li>
  )
}