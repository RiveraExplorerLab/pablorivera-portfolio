// src/routes/Community.tsx
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  createNewsletterSignup, 
  createEarlyAccessSignup, 
  isEmailSignedUp 
} from '../lib/communitySignups'

export default function Community() {
  useEffect(() => {
    // scroll to top when navigating here
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
            <div className="mt-3"><NewsletterForm /></div>
          </Card>

          <Card title="Early-access testers">
            Try tiny tools before they're public. I want blunt, kind feedback.
            <div className="mt-3"><WaitlistForm label="Join early-access waitlist" tag="ea" /></div>
          </Card>

          <Card title="Feedback & ideas">
            Have a clunky workflow? Tell me. If it's small and clear, I might build it.
            <div className="mt-3">
              <a
                className="text-teal-400 hover:text-teal-300 text-sm transition-colors"
                href="mailto:hello@pablorivera.dev?subject=Explorer%20Lab%20Idea"
              >
                Email an idea →
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
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <Link className="text-teal-400 hover:text-teal-300 transition-colors" to="/projects">
            See projects →
          </Link>
          <a className="text-teal-400 hover:text-teal-300 transition-colors" href="mailto:hello@pablorivera.dev">
            Email me →
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
      whileHover={{ y: -2 }}
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

    // Honeypot
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
      // Check for duplicate
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
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* Honeypot */}
      <input id="nl-company" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

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
        {status === 'loading' ? 'Joining…' : 'Join'}
      </button>

      <AnimatePresence>
        {status === 'ok' && (
          <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
            className="self-center text-xs text-teal-400">
            You're in. Thanks!
          </motion.span>
        )}
        {status === 'dup' && (
          <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
            className="self-center text-xs text-stone-400">
            Already subscribed.
          </motion.span>
        )}
        {status === 'err' && (
          <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
            className="self-center text-xs text-rose-400">
            {errMsg || 'Something went wrong.'}
          </motion.span>
        )}
      </AnimatePresence>
    </form>
  )
}

/** Early-access form → Firebase insert */
function WaitlistForm({ label, tag }: { label: string; tag: string }) {
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'dup' | 'err'>('idle')
  const [errMsg, setErrMsg] = useState('')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setErrMsg('')
    const form = e.target as HTMLFormElement

    // Honeypot
    const botCheck = form.querySelector<HTMLInputElement>('#wl-company')?.value
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
      // Check for duplicate
      const isDuplicate = await isEmailSignedUp(value, 'early-access')
      if (isDuplicate) {
        setStatus('dup')
        return
      }

      await createEarlyAccessSignup(email, notes, tag, navigator.userAgent)
      setStatus('ok')
      setEmail('')
      setNotes('')
    } catch (err) {
      console.error('Early access signup error:', err)
      setStatus('err')
      setErrMsg(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {/* Honeypot */}
      <input id="wl-company" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <label htmlFor={`wl-${tag}`} className="sr-only">Email</label>
      <input
        id={`wl-${tag}`}
        type="email"
        required
        value={email}
        onChange={e => { setEmail(e.target.value); if (status !== 'idle') { setStatus('idle'); setErrMsg('') } }}
        placeholder="you@example.com"
        className="input"
      />
      <textarea
        value={notes}
        onChange={e => { setNotes(e.target.value); if (status !== 'idle') { setStatus('idle'); setErrMsg('') } }}
        placeholder="What kinds of tools would you like to test?"
        rows={2}
        className="input"
      />
      <button
        type="submit"
        className="btn-secondary w-full justify-center"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Submitting…'
          : status === 'ok' ? 'Added — thanks!'
          : status === 'dup' ? 'Already on the list'
          : label}
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
                   focus:outline-none focus:ring-2 focus:ring-teal-500/60 transition-all"
        aria-expanded={open}
      >
        {q}
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
