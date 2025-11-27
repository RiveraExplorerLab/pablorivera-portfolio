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
          className="text-4xl md:text-5xl font-bold tracking-tight text-teal-400 flex items-center gap-3 mb-6"
        >
          Who I Am & What I Love Building
        </motion.h1>

        {/* Headshot + intro paragraph side by side */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          {/* Headshot bubble */}
          <motion.div 
            className="headshot-bubble w-32 h-32 md:w-40 md:h-40 shrink-0"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            whileHover={{ scale: 1.05 }}
          >
            <img
              src="/images/headshot.webp"
              alt="Pablo Rivera"
              className="w-full h-full object-cover object-top"
            />
          </motion.div>

          <div className="space-y-4 text-stone-300 max-w-3xl">
            <p>
              I'm someone who likes to understand how things really work — people, tools, processes, all of it. I build things that make life a little clearer, a little easier, and sometimes even a little fun. I love that moment when a tool makes you pause and think, <span className="italic">"Wait… this is actually good."</span> Not flashy — just thoughtful.
            </p>
            <p>
              Every app, interaction, and idea for me is a small experiment where function meets curiosity. I want my tools to reflect how people actually think, not just how data moves. I ask deep questions. I look for hidden constraints. I refactor not just the code, but the assumptions.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-stone-300 max-w-3xl">
          <p>
            Sometimes that means designing an internal order system with clean patch logic and finance-ready audit trails. Other times it's a playful terminal prompt that hands you a tech stack suggestion and a joke.
          </p>
          <p>
            I don't separate the playful from the purposeful — the best tools do both. For me, building is about discovering what's possible when curiosity is given structure, and creating systems that help people grow — including me.
          </p>
        </div>

        <div className="flex gap-3">
          <Link to="/projects" className="btn-primary">
            View Projects
          </Link>
          <a href="mailto:hello@pablorivera.dev" className="btn-secondary">
            Contact
          </a>
        </div>
      </section>

      {/* VALUES */}
      <section aria-labelledby="values-title" className="space-y-4">
        <h2 id="values-title" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          Core Values
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
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
          Beyond Work
        </h2>
        <p className="text-stone-300 max-w-2xl">
          I like taking things apart — code, cameras, old-school car parts — and figuring out how they fit back together.
          I shoot cinematic photos, play the piano, and dive into anime. I'm happiest when I'm learning,
          experimenting, or building something that didn't exist yesterday.
        </p>
        <ul className="flex flex-wrap gap-2">
          {['Photography', 'Piano', 'Old-school cars', 'Anime', 'Science & discovery'].map((tag) => (
            <li
              key={tag}
              className="text-xs px-3 py-1.5 rounded-full text-stone-200 transition-all duration-300 hover:scale-105 hover:border-white/30"
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              {tag}
            </li>
          ))}
        </ul>
      </section>

      {/* SNAPSHOTS */}
      <section aria-labelledby="timeline-title" className="space-y-4">
        <h2 id="timeline-title" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
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
      whileHover={{ y: -4, scale: 1.02 }}
      className="card p-5"
    >
      <h3 className="font-semibold text-stone-100 flex items-center gap-2">
        <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
        {title}
      </h3>
      <p className="text-sm text-stone-300 mt-2">{children}</p>
    </motion.article>
  )
}

function TimelineItem({
  when, what, children,
}: { when: string; what: string; children: React.ReactNode }) {
  return (
    <motion.li 
      className="card p-4"
      whileHover={{ x: 4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-baseline gap-3">
        <span className="text-xs uppercase tracking-wide text-teal-400 font-medium">{when}</span>
        <span className="font-medium text-stone-100">{what}</span>
      </div>
      <p className="text-sm text-stone-300 mt-1">{children}</p>
    </motion.li>
  )
}
