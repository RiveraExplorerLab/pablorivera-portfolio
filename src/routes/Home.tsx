// src/routes/Home.tsx
import { Link } from 'react-router-dom'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import SEO from '../components/SEO'
import { useEffect, useRef, useState, useCallback } from 'react'
import { useFeaturedProjects, useProjects } from '../hooks/useProjects'
import type { Project } from '../lib/types'
import { track } from '../lib/analytics'

// Ambient glow hook - follows mouse with smooth interpolation
function useAmbientGlow(containerRef: React.RefObject<HTMLElement | null>) {
  const [position, setPosition] = useState({ x: 50, y: 50 })
  const [isHovering, setIsHovering] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!containerRef.current || prefersReducedMotion) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setPosition({ x, y })
  }, [containerRef, prefersReducedMotion])
  
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    
    const handleEnter = () => setIsHovering(true)
    const handleLeave = () => setIsHovering(false)
    
    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseenter', handleEnter)
    container.addEventListener('mouseleave', handleLeave)
    
    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseenter', handleEnter)
      container.removeEventListener('mouseleave', handleLeave)
    }
  }, [containerRef, handleMouseMove])
  
  return { position, isHovering, prefersReducedMotion }
}

// Fun facts that rotate on click
const funFacts = [
  "I debug best at 2am ☕",
  "Vim or VS Code? Yes.",
  "I name variables like poems",
  "Currently: 47 browser tabs",
  "I speak fluent console.log",
  "Semicolons are optional (fight me)",
  "I once fixed a bug by deleting node_modules",
]

export default function Home() {
  const { data: featuredProjects } = useFeaturedProjects(1)
  const { data: allProjects } = useProjects()
  
  const featured: Project | null = featuredProjects?.[0] || null
  const plannedProjects = allProjects?.filter(p => p.status === 'planned') || []
  
  const prefersReducedMotion = useReducedMotion()
  
  // Ambient glow effect for hero
  const heroRef = useRef<HTMLElement>(null)
  const { position, isHovering } = useAmbientGlow(heroRef)

  // Fun fact state
  const [factIndex, setFactIndex] = useState(0)
  const cycleFact = () => {
    setFactIndex(i => (i + 1) % funFacts.length)
    track.funFactClick()
  }

  // Scroll indicator visibility
  const { scrollY } = useScroll()
  const scrollIndicatorOpacity = useTransform(scrollY, [0, 100], [1, 0])

  const phrases = [
    "Building tools that feel alive",
    "Making complexity disappear",
    "Turning caffeine into code",
    "Crafting pixels with purpose"
  ] as const

  const typed = useTypewriter(phrases, { typeMs: 55, deleteMs: 35, holdMs: 1400 })

  return (
    <>
      <SEO />
      <div>
      {/* HERO - Full viewport height */}
      <section 
        ref={heroRef}
        className="min-h-[calc(100dvh-3.5rem)] flex flex-col justify-center relative overflow-hidden -mt-8 sm:-mt-10 pb-16"
      >
        {/* Ambient glow effect */}
        {!prefersReducedMotion && (
          <div 
            className="pointer-events-none absolute inset-0 transition-opacity duration-500"
            style={{ opacity: isHovering ? 1 : 0 }}
          >
            <div 
              className="absolute w-[600px] h-[600px] rounded-full"
              style={{
                left: `${position.x}%`,
                top: `${position.y}%`,
                transform: 'translate(-50%, -50%)',
                background: 'radial-gradient(circle, rgba(240, 180, 41, 0.08) 0%, rgba(240, 180, 41, 0) 70%)',
                transition: 'left 0.3s ease-out, top 0.3s ease-out',
              }}
            />
          </div>
        )}
        
        <div className="space-y-8 relative z-10 max-w-3xl">
          {/* Greeting with time awareness */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-[#9d99a9] text-lg"
          >
            <TimeGreeting />
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-[#e8e6f0] leading-[1.1]"
          >
            I'm{' '}
            <span className="gradient-text relative inline-block group/name cursor-pointer" onClick={cycleFact}>
              Pablo
              <span 
                className="absolute -inset-2 rounded-lg bg-[#f0b429]/0 group-hover/name:bg-[#f0b429]/10 transition-all duration-300 -z-10"
                style={{ filter: 'blur(8px)' }}
              />
            </span>
            <span className="text-[#f0b429]">.</span>
            <span className="block text-[#9d99a9] text-2xl sm:text-3xl md:text-4xl mt-3 font-medium" aria-live="polite">
              {typed}
              {!prefersReducedMotion && (
                <motion.span
                  className="inline-block w-[2px] h-[1em] ml-1 align-middle bg-[#f0b429]"
                  initial={{ opacity: 1 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
              )}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="text-lg sm:text-xl text-[#9d99a9] max-w-2xl leading-relaxed"
          >
            I'm a developer who treats code like craft — obsessing over the details
            until software feels less like a tool and more like an extension of thought.
            <span className="hidden sm:inline"> Currently exploring the edges of what's possible with React, TypeScript, and a lot of curiosity.</span>
          </motion.p>

          {/* Fun fact easter egg */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            onClick={cycleFact}
            className="text-sm text-[#9d99a9]/60 hover:text-[#f0b429] transition-colors cursor-pointer text-left"
          >
            <span className="text-[#f0b429]/40">→</span> {funFacts[factIndex]}
          </motion.button>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="flex flex-wrap gap-3 pt-2"
          >
            <Link to="/projects" className="btn-primary">
              See my work
              <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/about" className="btn-secondary">
              More about me
            </Link>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          style={{ opacity: scrollIndicatorOpacity }}
        >
          <span className="text-xs text-[#9d99a9]/50 uppercase tracking-widest">Scroll</span>
          <motion.div
            className="w-5 h-8 rounded-full border border-[#9d99a9]/30 flex justify-center pt-2"
            initial={{ opacity: 0.5 }}
          >
            <motion.div
              className="w-1 h-1 rounded-full bg-[#f0b429]"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Rest of content */}
      <div className="space-y-20 pb-8">
        {/* PRINCIPLES */}
        <section aria-label="Principles" className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🧠</span>
            <h2 className="text-xl font-semibold text-[#e8e6f0]">
              How I think about building
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                emoji: "🔬",
                title: "Dissect everything",
                desc: "I take systems apart to see how they tick. Then I rebuild them so they tick better.",
                color: "from-cyan-500/20 to-cyan-600/10",
                border: "border-cyan-500/20"
              },
              {
                emoji: "✨",
                title: "Make it obvious",
                desc: "The best interfaces explain themselves. Every click should feel inevitable.",
                color: "from-[#f0b429]/20 to-[#fbbf24]/10",
                border: "border-[#f0b429]/20"
              },
              {
                emoji: "🚀",
                title: "Ship to learn",
                desc: "Real feedback beats perfect plans. I prototype fast, then let reality be my teacher.",
                color: "from-purple-500/20 to-purple-600/10",
                border: "border-purple-500/20"
              },
            ].map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className={`card p-6 group hover:${item.border} transition-all`}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform`}>
                  {item.emoji}
                </div>
                <h3 className="font-semibold text-[#e8e6f0] text-lg">{item.title}</h3>
                <p className="text-[#9d99a9] mt-2 leading-relaxed">{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </section>

        {/* FEATURED BUILD */}
        {featured && (
          <section aria-label="Featured build" className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⭐</span>
              <h2 className="text-xl font-semibold text-[#e8e6f0]">
                What I'm proud of
              </h2>
            </div>
            <Link
              to={`/projects/${featured.slug}`}
              className="block no-underline hover:no-underline"
            >
              <motion.div 
                className="card overflow-hidden group"
                whileHover={{ scale: 1.01 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid md:grid-cols-[300px,1fr] gap-0">
                  {/* Image */}
                  <div className="relative h-52 md:h-full overflow-hidden bg-gradient-to-br from-[#f0b429]/20 to-[#fbbf24]/10">
                    {featured.coverImage ? (
                      <img
                        src={featured.coverImage}
                        alt=""
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl text-[#f0b429]/20">✦</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-6 md:p-8 flex flex-col justify-center">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs px-2.5 py-1 rounded-full bg-[#f0b429]/10 text-[#f0b429] border border-[#f0b429]/20 font-medium">
                        Featured
                      </span>
                    </div>
                    <h3 className="text-2xl font-semibold text-[#e8e6f0] group-hover:text-[#f0b429] transition-colors">
                      {featured.title}
                    </h3>
                    {featured.summary && (
                      <p className="text-[#9d99a9] mt-3 text-lg leading-relaxed line-clamp-2">{featured.summary}</p>
                    )}
                    
                    {featured.techStack && featured.techStack.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-5">
                        {featured.techStack.slice(0, 4).map((tech) => (
                          <span
                            key={tech}
                            className="text-xs px-2.5 py-1 rounded-full bg-white/5 text-[#9d99a9] border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-6 flex items-center gap-2 text-[#f0b429] group-hover:text-[#fbbf24] font-medium">
                      Check it out
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          </section>
        )}

        {/* PLANNED PROJECTS */}
        {plannedProjects.length > 0 && (
          <section aria-label="Planned projects" className="space-y-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔮</span>
              <h2 className="text-xl font-semibold text-[#e8e6f0]">
                What's brewing
              </h2>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {plannedProjects.map((project, i) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="card p-5 group hover:border-purple-500/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold text-[#e8e6f0]">{project.title}</h3>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 shrink-0">
                      Soon™
                    </span>
                  </div>
                  {project.summary && (
                    <p className="text-sm text-[#9d99a9] mt-2 leading-relaxed">{project.summary}</p>
                  )}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {project.techStack.slice(0, 3).map((tech) => (
                        <span
                          key={tech}
                          className="text-[10px] px-2 py-0.5 rounded-full glass text-[#9d99a9]"
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
        <section className="card p-8 md:p-12 text-center relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#f0b429]/5 via-transparent to-purple-500/5" />
          
          <div className="relative z-10">
            <span className="text-4xl mb-4 block">👋</span>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#e8e6f0]">
              Let's build something together
            </h2>
            <p className="text-[#9d99a9] mt-3 max-w-lg mx-auto text-lg">
              Whether it's a wild idea, a technical challenge, or just a good conversation about code — I'm always down.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/community" className="btn-primary">
                Join the Inner Loop
              </Link>
              <a href="mailto:hello@pablorivera.dev" className="btn-secondary">
                Say hello
              </a>
            </div>
          </div>
        </section>
      </div>
    </div>
    </>
  )
}

// Time-aware greeting component
function TimeGreeting() {
  const [greeting, setGreeting] = useState('')
  
  useEffect(() => {
    const hour = new Date().getHours()
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning — grab some coffee ☕")
    } else if (hour >= 12 && hour < 17) {
      setGreeting("Good afternoon — hope your code compiles")
    } else if (hour >= 17 && hour < 21) {
      setGreeting("Good evening — winding down?")
    } else {
      setGreeting("Working late? Same here 🌙")
    }
  }, [])
  
  return <>{greeting}</>
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
