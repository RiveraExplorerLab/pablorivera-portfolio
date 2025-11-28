// src/routes/Home.tsx
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { useFeaturedProjects, useProjects } from '../hooks/useProjects'
import type { Project } from '../lib/types'

export default function Home() {
  const { data: featuredProjects } = useFeaturedProjects(1)
  const { data: allProjects } = useProjects()
  
  // Only show featured if there's actually a featured project
  const featured: Project | null = featuredProjects?.[0] || null
  
  // Get planned projects (status = 'planned')
  const plannedProjects = allProjects?.filter(p => p.status === 'planned') || []
  
  const prefersReducedMotion = useReducedMotion()

  const phrases = [
    "Designing systems with personality",
    "Learning through every build",
    "Shaping ideas into working tools"
  ] as const

  const typed = useTypewriter(phrases, { typeMs: 55, deleteMs: 35, holdMs: 1100 })

  return (
    <div className="space-y-16">
      {/* HERO */}
      <section className="pt-4 md:pt-8">
        <div className="space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-stone-100"
          >
            I&apos;m <span className="gradient-text">Pablo</span>.
            <span className="block text-stone-400 mt-2" aria-live="polite" aria-atomic="true">
              {typed}
              {!prefersReducedMotion && (
                <motion.span
                  className="inline-block w-[0.6ch] align-baseline gradient-text"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                >
                  |
                </motion.span>
              )}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-lg text-stone-300 max-w-2xl leading-relaxed"
          >
            I approach software like an artist approaches a canvas — exploring, experimenting,
            and refining until tools feel as intuitive as they are capable.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex flex-wrap gap-3"
          >
            <Link to="/about" className="btn-primary">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              About Me
            </Link>
            <Link to="/projects" className="btn-secondary">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              View Projects
            </Link>
          </motion.div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section aria-label="Principles" className="space-y-4">
        <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider">
          How I Build
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
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
              desc: "Start simple, test early, and let real feedback shape the next iteration."
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

      {/* FEATURED BUILD - Only show if there's a featured project */}
      {featured && (
        <section aria-label="Featured build" className="space-y-4">
          <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider">
            Featured Project
          </h2>
          <Link
            to={`/projects/${featured.slug}`}
            className="block no-underline hover:no-underline"
          >
            <motion.div 
              className="card overflow-hidden group"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="grid md:grid-cols-[280px,1fr] gap-0">
                {/* Image */}
                <div className="relative h-48 md:h-full overflow-hidden bg-gradient-to-br from-teal-500/20 to-cyan-500/10">
                  {featured.coverImage ? (
                    <img
                      src={featured.coverImage}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-5xl text-teal-400/20">✦</span>
                    </div>
                  )}
                </div>
                
                {/* Content */}
                <div className="p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs px-2 py-1 rounded-full bg-teal-500/10 text-teal-400 border border-teal-500/20">
                      Featured
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-stone-100 group-hover:text-teal-300 transition-colors">
                    {featured.title}
                  </h3>
                  {featured.summary && (
                    <p className="text-stone-400 mt-2 line-clamp-2">{featured.summary}</p>
                  )}
                  
                  {/* Tech Stack */}
                  {featured.techStack && featured.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {featured.techStack.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-stone-500 border border-white/10"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4 flex items-center gap-4 text-sm">
                    <span className="text-teal-400 group-hover:text-teal-300 inline-flex items-center gap-1">
                      View Project
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </Link>
          
          <div className="text-center">
            <Link 
              to="/projects" 
              className="text-sm text-stone-500 hover:text-teal-400 transition-colors inline-flex items-center gap-1"
            >
              See all projects
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </section>
      )}

      {/* PLANNED PROJECTS - Only show if there are planned projects */}
      {plannedProjects.length > 0 && (
        <section aria-label="Planned projects" className="space-y-4">
          <h2 className="text-sm font-medium text-stone-400 uppercase tracking-wider">
            Coming Soon
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {plannedProjects.map((project, i) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.2, delay: i * 0.05 }}
                className="card p-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-medium text-stone-100">{project.title}</h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                    🔮 Planned
                  </span>
                </div>
                {project.summary && (
                  <p className="text-sm text-stone-400 mt-2">{project.summary}</p>
                )}
                {project.techStack && project.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 rounded-full glass text-stone-500"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="card p-6 md:p-8 text-center">
        <h2 className="text-xl font-semibold text-stone-100">Want to connect?</h2>
        <p className="text-stone-400 mt-2 max-w-md mx-auto">
          I'm always open to interesting conversations and collaborations.
        </p>
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Link to="/community" className="btn-primary">
            Join Community
          </Link>
          <a href="mailto:hello@pablorivera.dev" className="btn-secondary">
            Email Me
          </a>
        </div>
      </section>
    </div>
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
