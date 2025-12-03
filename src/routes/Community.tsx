// src/routes/Community.tsx
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  createNewsletterSignup, 
  isEmailSignedUp 
} from '../lib/communitySignups'
import { createAccessRequest, hasPendingRequest } from '../lib/accessRequests'
import { useProjects } from '../hooks/useProjects'
import type { Project } from '../lib/types'
import SEO from '../components/SEO'

export default function Community() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <>
      <SEO 
        title="Community" 
        description="Join the lab — a calm space for small, sharp experiments. Get early access to projects, honest progress notes, and help shape what gets built next."
      />
      <div className="space-y-16">
      {/* HERO */}
      <section className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-[#e8e6f0]">
            Join the Lab
          </h1>
          <p className="max-w-2xl text-lg text-[#9d99a9] mt-4 leading-relaxed">
            A calm space for small, sharp experiments — simple tools, honest notes, 
            and feedback that helps things get better.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="flex flex-wrap gap-3"
        >
          <a
            href="https://discord.gg/ZmrmMQ5mkQ"
            target="_blank"
            rel="noreferrer"
            className="btn-primary"
          >
            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            Join Discord
          </a>
          <Link to="/blog" className="btn-secondary">
            Read Notes
          </Link>
        </motion.div>
      </section>

      {/* WAYS TO JOIN */}
      <section aria-labelledby="join" className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#f0b429]/20 to-[#fbbf24]/10 border border-[#f0b429]/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-[#f0b429]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <div>
            <h2 id="join" className="text-2xl font-semibold text-[#e8e6f0]">Ways to Join</h2>
            <p className="text-sm text-[#9d99a9]">Pick what fits your interest</p>
          </div>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-3">
          <JoinCard 
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            }
            title="Newsletter"
            description="Short, occasional notes on what I'm building and why it matters."
            color="amber"
          >
            <NewsletterForm />
          </JoinCard>

          <JoinCard 
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            }
            title="Early Access"
            description="Try tools before they're public. I want blunt, kind feedback."
            color="purple"
          >
            <EarlyAccessForm />
          </JoinCard>

          <JoinCard 
            icon={
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            }
            title="Ideas & Feedback"
            description="Have a clunky workflow? Tell me. If it's small and clear, I might build it."
            color="cyan"
          >
            <a
              className="btn-secondary w-full justify-center no-underline hover:no-underline"
              href="mailto:hello@pablorivera.dev?subject=Explorer%20Lab%20Idea"
            >
              Email an idea
            </a>
          </JoinCard>
        </div>
      </section>

      {/* ETHOS */}
      <section aria-labelledby="ethos" className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h2 id="ethos" className="text-2xl font-semibold text-[#e8e6f0]">Ethos</h2>
            <p className="text-sm text-[#9d99a9]">How we work together</p>
          </div>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            { 
              title: 'Clarity first', 
              body: 'Plain language, short demos, honest trade-offs.',
              icon: '✦'
            },
            { 
              title: 'Tight loops', 
              body: 'Ship small, learn fast, document decisions.',
              icon: '↻'
            },
            { 
              title: 'Kind candor', 
              body: 'Challenge ideas, not people. Direct but respectful.',
              icon: '♡'
            },
          ].map((item, i) => (
            <motion.article
              key={item.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 group hover:border-[#f0b429]/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-lg text-[#f0b429]">{item.icon}</span>
                <h3 className="font-semibold text-[#e8e6f0]">{item.title}</h3>
              </div>
              <p className="text-sm text-[#9d99a9] leading-relaxed">{item.body}</p>
            </motion.article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 border border-pink-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 id="faq" className="text-2xl font-semibold text-[#e8e6f0]">FAQ</h2>
            <p className="text-sm text-[#9d99a9]">Common questions</p>
          </div>
        </motion.div>

        <div className="space-y-3 max-w-2xl">
          <Faq q="How often is the newsletter?">
            Irregular but thoughtful — only when there's something worth your time. 
            Expect maybe 1-2 per month at most.
          </Faq>
          <Faq q="What do early-access testers do?">
            You'll get links to small prototypes before they're public. 
            Kick the tires; tell me what's confusing or slow. No time commitment required.
          </Faq>
          <Faq q="Will this be open source?">
            Some things, yes. Others will be write-ups explaining the approach. 
            I share what's most useful to others learning.
          </Faq>
        </div>
      </section>

      {/* CTA */}
      <section className="card p-8 md:p-10 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0b429]/5 to-transparent" />
        <div className="relative">
          <h2 className="text-2xl font-semibold text-[#e8e6f0]">Not sure where to start?</h2>
          <p className="text-[#9d99a9] mt-3 max-w-md mx-auto">
            Browse a project, then reply with one thing that could be clearer. That's it.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link className="btn-primary no-underline hover:no-underline" to="/projects">
              See Projects
            </Link>
            <a className="btn-secondary no-underline hover:no-underline" href="mailto:hello@pablorivera.dev">
              Email Me
            </a>
          </div>
        </div>
      </section>
      </div>
    </>
  )
}

/* ------------ Components ------------ */

type JoinCardProps = {
  icon: React.ReactNode
  title: string
  description: string
  color: 'amber' | 'purple' | 'cyan'
  children: React.ReactNode
}

const colorConfig = {
  amber: { bg: 'from-[#f0b429]/20 to-[#fbbf24]/10', border: 'border-[#f0b429]/20', text: 'text-[#f0b429]' },
  purple: { bg: 'from-purple-500/20 to-purple-600/10', border: 'border-purple-500/20', text: 'text-purple-400' },
  cyan: { bg: 'from-cyan-500/20 to-cyan-600/10', border: 'border-cyan-500/20', text: 'text-cyan-400' },
}

function JoinCard({ icon, title, description, color, children }: JoinCardProps) {
  const config = colorConfig[color]
  
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="card p-6 flex flex-col"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.bg} border ${config.border} flex items-center justify-center ${config.text}`}>
          {icon}
        </div>
        <h3 className="font-semibold text-[#e8e6f0]">{title}</h3>
      </div>
      <p className="text-sm text-[#9d99a9] mb-4 flex-1">{description}</p>
      {children}
    </motion.article>
  )
}

/** Newsletter form → Firebase insert */
function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'dup' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState<string>('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrMsg('')

    const form = e.target as HTMLFormElement
    const botCheck = form.querySelector<HTMLInputElement>('#nl-company')?.value
    if (botCheck) return

    const value = email.trim()
    const isValidEmail = /\S+@\S+\.\S+/.test(value)
    if (!isValidEmail) {
      setStatus('err')
      setErrMsg('Please enter a valid email address.')
      return
    }

    setStatus('loading')

    try {
      const isDuplicate = await isEmailSignedUp(value, 'newsletter')
      if (isDuplicate) {
        setStatus('dup')
        return
      }

      await createNewsletterSignup(value, navigator.userAgent)
      setStatus('ok')
      setEmail('')
    } catch (err) {
      console.error('Newsletter signup error:', err)
      setStatus('err')
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  if (status === 'ok') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-3 rounded-lg bg-[#f0b429]/10 border border-[#f0b429]/20 text-center"
      >
        <p className="text-sm text-[#f0b429] font-medium">You're in! ✦</p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input id="nl-company" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="flex gap-2">
        <label htmlFor="nl" className="sr-only">Email</label>
        <input
          id="nl"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={e => { setEmail(e.target.value); if (status !== 'idle') { setStatus('idle'); setErrMsg('') } }}
          placeholder="you@example.com"
          className="input min-w-0 flex-1"
        />
        <button
          type="submit"
          className="btn-primary"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? '...' : 'Join'}
        </button>
      </div>

      <AnimatePresence>
        {status === 'dup' && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
            className="text-xs text-[#9d99a9]">
            Already subscribed — you're good!
          </motion.p>
        )}
        {status === 'err' && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
            className="text-xs text-rose-400">
            {errMsg || 'Something went wrong.'}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

/** Early-access form with project dropdown */
function EarlyAccessForm() {
  const { data: projects } = useProjects()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [selectedProject, setSelectedProject] = useState<string>('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'dup' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const availableProjects = projects?.filter(
    (p: Project) => p.requiresAuth && p.accessRequestEnabled
  ) || []

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrMsg('')

    const form = e.target as HTMLFormElement
    const botCheck = form.querySelector<HTMLInputElement>('#ea-company')?.value
    if (botCheck) return

    const trimmedEmail = email.trim().toLowerCase()
    const trimmedName = name.trim()
    const trimmedMessage = message.trim()

    const isValidEmail = /\S+@\S+\.\S+/.test(trimmedEmail)
    if (!isValidEmail) {
      setStatus('err')
      setErrMsg('Please enter a valid email address.')
      return
    }

    if (!trimmedName) {
      setStatus('err')
      setErrMsg('Please enter your name.')
      return
    }

    if (!selectedProject) {
      setStatus('err')
      setErrMsg('Please select a project.')
      return
    }

    const project = availableProjects.find((p: Project) => p.id === selectedProject)
    if (!project) {
      setStatus('err')
      setErrMsg('Invalid project selected.')
      return
    }

    setStatus('loading')

    try {
      const hasPending = await hasPendingRequest(trimmedEmail, project.id)
      if (hasPending) {
        setStatus('dup')
        return
      }

      await createAccessRequest(
        trimmedEmail,
        trimmedName,
        trimmedMessage || 'Requested via Community page',
        project.id,
        project.slug,
        project.title,
        navigator.userAgent
      )
      
      setStatus('ok')
      setEmail('')
      setName('')
      setSelectedProject('')
      setMessage('')
    } catch (err) {
      console.error('Early access signup error:', err)
      setStatus('err')
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  function resetStatus() {
    if (status !== 'idle') {
      setStatus('idle')
      setErrMsg('')
    }
  }

  if (availableProjects.length === 0) {
    return (
      <div className="text-xs text-[#9d99a9]/60 p-3 rounded-lg bg-white/5 border border-white/10 text-center">
        No projects available for early access right now.
      </div>
    )
  }

  if (status === 'ok') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-3 rounded-lg bg-purple-500/10 border border-purple-500/20 text-center"
      >
        <p className="text-sm text-purple-400 font-medium">Request submitted! ⚡</p>
        <p className="text-xs text-[#9d99a9] mt-1">I'll review it soon.</p>
      </motion.div>
    )
  }

  if (status === 'dup') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-center"
      >
        <p className="text-sm text-amber-400 font-medium">Already requested</p>
        <button
          onClick={() => setStatus('idle')}
          className="text-xs text-[#f0b429] hover:text-[#fbbf24] mt-1"
        >
          Try another project →
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input id="ea-company" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <select
        id="ea-project"
        value={selectedProject}
        onChange={e => { setSelectedProject(e.target.value); resetStatus() }}
        className="input w-full appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239d99a9'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1rem',
          paddingRight: '2.5rem',
        }}
      >
        <option value="">Select project...</option>
        {availableProjects.map((project: Project) => (
          <option key={project.id} value={project.id}>
            {project.title}
          </option>
        ))}
      </select>

      <div className="grid grid-cols-2 gap-2">
        <input
          id="ea-name"
          type="text"
          required
          value={name}
          onChange={e => { setName(e.target.value); resetStatus() }}
          placeholder="Name"
          className="input"
        />
        <input
          id="ea-email"
          type="email"
          required
          value={email}
          onChange={e => { setEmail(e.target.value); resetStatus() }}
          placeholder="Email"
          className="input"
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full justify-center"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Submitting...' : 'Request Access'}
      </button>

      <AnimatePresence>
        {status === 'err' && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            className="text-xs text-rose-400 text-center"
          >
            {errMsg || 'Something went wrong.'}
          </motion.p>
        )}
      </AnimatePresence>
    </form>
  )
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  
  return (
    <motion.div 
      className="card overflow-hidden"
      initial={false}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-5 py-4 text-left font-medium text-[#e8e6f0] hover:bg-white/5
                   focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#f0b429]/60 transition-all
                   flex items-center justify-between gap-4"
        aria-expanded={open}
      >
        <span>{q}</span>
        <motion.svg 
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="w-5 h-5 text-[#9d99a9] shrink-0"
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 text-sm text-[#9d99a9] leading-relaxed">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
