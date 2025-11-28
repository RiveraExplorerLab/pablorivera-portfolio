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

export default function Community() {
  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-4xl md:text-5xl font-bold tracking-tight text-stone-100 flex items-center gap-3"
        >
          <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
          Community
        </motion.h1>
        <p className="max-w-2xl text-stone-300">
          A calm space for small, sharp experiments — simple tools, honest notes, and feedback that helps things get better.
        </p>

        <div className="flex flex-wrap gap-3">
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
        </div>
      </section>

      {/* WAYS TO JOIN */}
      <section aria-labelledby="join" className="space-y-4">
        <h2 id="join" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          Ways to join
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Newsletter">
            Short, occasional notes on what I'm building and why it matters.
            <div className="mt-4"><NewsletterForm /></div>
          </Card>

          <Card title="Early-access testers">
            Try tools before they're public. I want blunt, kind feedback.
            <div className="mt-4"><EarlyAccessForm /></div>
          </Card>

          <Card title="Feedback & ideas">
            Have a clunky workflow? Tell me. If it's small and clear, I might build it.
            <div className="mt-4">
              <a
                className="btn-secondary w-full justify-center no-underline hover:no-underline"
                href="mailto:hello@pablorivera.dev?subject=Explorer%20Lab%20Idea"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email an idea
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* ETHOS */}
      <section aria-labelledby="ethos" className="space-y-3">
        <h2 id="ethos" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          Ethos
        </h2>
        <ul className="grid gap-4 md:grid-cols-3">
          {[
            ['Clarity first', 'Plain language, short demos, honest trade-offs.'],
            ['Tight loops', 'Ship small, learn fast, document decisions.'],
            ['Kind candor', 'Challenge ideas, not people. Direct but respectful.'],
          ].map(([title, body]) => (
            <motion.li 
              key={title} 
              className="card p-4"
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <div className="font-medium text-stone-100 flex items-center gap-2">
                <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
                {title}
              </div>
              <p className="text-sm text-stone-300 mt-1">{body}</p>
            </motion.li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="space-y-4">
        <h2 id="faq" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          FAQ
        </h2>
        <div className="space-y-2">
          <Faq q="How often is the newsletter?">
            Irregular but thoughtful — only when there's something worth your time.
          </Faq>
          <Faq q="What do early-access testers do?">
            You'll get links to small prototypes. Kick the tires; tell me what's confusing or slow.
          </Faq>
          <Faq q="Will this be open source?">
            Some things, yes. Others will be write-ups. I share what's most useful.
          </Faq>
        </div>
      </section>

      {/* CTA */}
      <section className="card p-6">
        <h2 className="text-xl font-semibold text-stone-100">Start anywhere</h2>
        <p className="text-stone-300 text-sm mt-1">
          Not sure where to click? Browse a project, then reply with one thing that could be clearer.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link className="btn-secondary no-underline hover:no-underline" to="/projects">
            See projects
          </Link>
          <a className="btn-secondary no-underline hover:no-underline" href="mailto:hello@pablorivera.dev">
            Email me
          </a>
        </div>
      </section>
    </div>
  )
}

/* ------------ Components ------------ */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 6 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.18 }}
      className="card p-5"
    >
      <h3 className="font-semibold text-stone-100 flex items-center gap-2">
        <span className="inline-block size-1.5 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
        {title}
      </h3>
      <div className="text-sm text-stone-300 mt-2">{children}</div>
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
        {status === 'ok' && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
            className="text-xs text-teal-400">
            You're in. Thanks!
          </motion.p>
        )}
        {status === 'dup' && (
          <motion.p initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
            className="text-xs text-stone-400">
            Already subscribed.
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

  // Filter to only projects that require auth and have access requests enabled
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
      // Check for existing pending request
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
      <div className="text-xs text-stone-500 p-3 rounded-lg bg-white/5 border border-white/10">
        No projects available for early access at the moment. Check back soon!
      </div>
    )
  }

  if (status === 'ok') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-lg bg-teal-500/10 border border-teal-500/20"
      >
        <p className="text-sm text-teal-400 font-medium flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Request submitted!
        </p>
        <p className="text-xs text-stone-400 mt-1">
          I'll review your request and get back to you soon.
        </p>
      </motion.div>
    )
  }

  if (status === 'dup') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/20"
      >
        <p className="text-sm text-amber-400 font-medium">Already requested</p>
        <p className="text-xs text-stone-400 mt-1">
          You have a pending request for this project. I'll review it soon.
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="text-xs text-teal-400 hover:text-teal-300 mt-2"
        >
          Request another project →
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input id="ea-company" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="space-y-1">
        <label htmlFor="ea-project" className="text-xs text-stone-400">
          Select a project
        </label>
        <select
          id="ea-project"
          value={selectedProject}
          onChange={e => { setSelectedProject(e.target.value); resetStatus() }}
          className="input w-full appearance-none cursor-pointer"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2357534e'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'right 0.75rem center',
            backgroundSize: '1rem',
            paddingRight: '2.5rem',
          }}
        >
          <option value="">Choose a project...</option>
          {availableProjects.map((project: Project) => (
            <option key={project.id} value={project.id}>
              {project.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label htmlFor="ea-name" className="text-xs text-stone-400">
            Name
          </label>
          <input
            id="ea-name"
            type="text"
            required
            value={name}
            onChange={e => { setName(e.target.value); resetStatus() }}
            placeholder="Your name"
            className="input"
          />
        </div>
        <div className="space-y-1">
          <label htmlFor="ea-email" className="text-xs text-stone-400">
            Email
          </label>
          <input
            id="ea-email"
            type="email"
            required
            value={email}
            onChange={e => { setEmail(e.target.value); resetStatus() }}
            placeholder="you@example.com"
            className="input"
          />
        </div>
      </div>

      <div className="space-y-1">
        <label htmlFor="ea-message" className="text-xs text-stone-400">
          Why are you interested? <span className="text-stone-600">(optional)</span>
        </label>
        <textarea
          id="ea-message"
          value={message}
          onChange={e => { setMessage(e.target.value); resetStatus() }}
          placeholder="Tell me a bit about yourself..."
          rows={2}
          className="input"
        />
      </div>

      <button
        type="submit"
        className="btn-primary w-full justify-center"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? (
          <>
            <svg className="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Submitting...
          </>
        ) : (
          <>
            <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Request Access
          </>
        )}
      </button>

      <AnimatePresence>
        {status === 'err' && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            className="text-xs text-rose-400"
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
    <div className="card overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 text-left font-medium text-stone-100 hover:bg-white/5
                   focus:outline-none focus:ring-2 focus:ring-teal-500/60 transition-all
                   flex items-center justify-between"
        aria-expanded={open}
      >
        {q}
        <svg 
          className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="px-4 pb-4 text-sm text-stone-300"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
