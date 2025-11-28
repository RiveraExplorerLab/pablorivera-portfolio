// src/routes/About.tsx
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function About() {
  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="space-y-6">
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-stone-100 flex items-center gap-3"
        >
          <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
          Who I Am & What I Love Building
        </motion.h1>

        {/* Headshot + intro */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-col md:flex-row gap-8 items-start"
        >
          {/* Headshot */}
          <div className="relative shrink-0">
            <div className="absolute -inset-1 bg-gradient-to-r from-teal-400 to-cyan-400 rounded-2xl opacity-20 blur-lg" />
            <div className="relative w-36 h-36 md:w-44 md:h-44 rounded-2xl overflow-hidden border border-white/10">
              <img
                src="/images/headshot.webp"
                alt="Pablo Rivera"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>

          <div className="space-y-4 text-stone-300 max-w-2xl">
            <p className="text-lg leading-relaxed">
              I'm someone who likes to understand how things really work — people, tools, processes, all of it. I build things that make life a little clearer, a little easier, and sometimes even a little fun.
            </p>
            <p className="leading-relaxed">
              I love that moment when a tool makes you pause and think, <span className="italic text-teal-400">"Wait… this is actually good."</span> Not flashy — just thoughtful.
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="space-y-4 text-stone-300 max-w-3xl"
        >
          <p>
            Every app, interaction, and idea for me is a small experiment where function meets curiosity. I want my tools to reflect how people actually think, not just how data moves. I ask deep questions. I look for hidden constraints. I refactor not just the code, but the assumptions.
          </p>
          <p>
            I don't separate the playful from the purposeful — the best tools do both. For me, building is about discovering what's possible when curiosity is given structure.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.3 }}
          className="flex flex-wrap gap-3"
        >
          <Link to="/projects" className="btn-primary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            View Projects
          </Link>
          <a href="mailto:hello@pablorivera.dev" className="btn-secondary">
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Contact
          </a>
        </motion.div>
      </section>

      {/* VALUES */}
      <section aria-labelledby="values-title" className="space-y-4">
        <h2 id="values-title" className="text-sm font-medium text-stone-400 uppercase tracking-wider">
          Core Values
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              ),
              title: "Dissect to Understand",
              desc: "I take systems apart to see how they really move, then rebuild them so people move faster."
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              ),
              title: "Make It Feel Obvious",
              desc: "Tools should lower cognitive load. Clear defaults, fewer clicks, interfaces that explain themselves."
            },
            {
              icon: (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              ),
              title: "Prototype to Learn",
              desc: "Ship the smallest useful version, gather feedback, and let reality shape the next iteration."
            },
          ].map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="card p-5 group hover:border-teal-500/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20 group-hover:bg-teal-500/20 transition-colors">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-stone-100">{item.title}</h3>
              </div>
              <p className="text-sm text-stone-400 leading-relaxed">{item.desc}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* BEYOND WORK */}
      <section aria-labelledby="beyond-title" className="space-y-4">
        <h2 id="beyond-title" className="text-sm font-medium text-stone-400 uppercase tracking-wider">
          Beyond Work
        </h2>
        <div className="card p-6">
          <p className="text-stone-300 leading-relaxed">
            I like taking things apart — code, cameras, old-school car parts — and figuring out how they fit back together.
            I shoot cinematic photos, play the piano, and dive into anime. I'm happiest when I'm learning,
            experimenting, or building something that didn't exist yesterday.
          </p>
          <div className="flex flex-wrap gap-2 mt-4">
            {[
              { name: 'Photography', icon: '📷' },
              { name: 'Piano', icon: '🎹' },
              { name: 'Old-school cars', icon: '🚗' },
              { name: 'Anime', icon: '✨' },
              { name: 'Science & discovery', icon: '🔬' },
            ].map((tag) => (
              <span
                key={tag.name}
                className="text-xs px-3 py-1.5 rounded-full glass text-stone-300 inline-flex items-center gap-1.5"
              >
                <span>{tag.icon}</span>
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* SNAPSHOTS */}
      <section aria-labelledby="timeline-title" className="space-y-4">
        <h2 id="timeline-title" className="text-sm font-medium text-stone-400 uppercase tracking-wider">
          Snapshots
        </h2>
        <div className="space-y-3">
          {[
            {
              when: '2025',
              what: 'Exploring personal tools',
              desc: 'Building a portfolio and side projects to explore the edges of what I can make.'
            },
            {
              when: '2023–2024',
              what: 'Power Platform + Web',
              desc: 'Turned messy paper processes into reliable apps and automations.'
            },
            {
              when: 'Earlier',
              what: 'Systems thinking',
              desc: 'Learned to map problems, constrain scope, and name trade-offs.'
            },
          ].map((item, i) => (
            <motion.div
              key={item.when}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.2, delay: i * 0.05 }}
              className="relative pl-6 pb-6 border-l border-white/10 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400 border-2 border-slate-950" />
              
              <div className="card p-4">
                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-xs font-medium px-2 py-0.5 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20">
                    {item.when}
                  </span>
                  <span className="font-medium text-stone-100">{item.what}</span>
                </div>
                <p className="text-sm text-stone-400 mt-2">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="card p-6 md:p-8 text-center">
        <h2 className="text-xl font-semibold text-stone-100">Let's build something together</h2>
        <p className="text-stone-400 mt-2 max-w-md mx-auto">
          Whether it's a collaboration, a question, or just a hello — I'd love to hear from you.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link to="/community" className="btn-primary">
            Join Community
          </Link>
          <a href="mailto:hello@pablorivera.dev" className="btn-secondary">
            Send Email
          </a>
        </div>
      </section>
    </div>
  )
}
