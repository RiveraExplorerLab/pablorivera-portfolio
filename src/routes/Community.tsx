// src/routes/Community.tsx
import { useState, useEffect } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

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
          <span className="inline-block size-2 rounded-full bg-emerald-400" />
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
            className="inline-flex items-center rounded-lg bg-emerald-400 text-black px-4 py-2 text-sm font-medium hover:bg-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            Join Discord
          </a>
          <Link
            to="/blog"
            className="inline-flex items-center rounded-lg border border-stone-700 px-4 py-2 text-sm font-medium text-stone-200 hover:border-emerald-500/50 hover:bg-stone-900 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            Read Notes
          </Link>
        </div>
      </section>

      {/* WAYS TO JOIN */}
      <section aria-labelledby="join" className="space-y-4">
        <h2 id="join" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
          Ways to join
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <Card title="Newsletter">
            Short, occasional notes on what I’m building and why it matters.
            <div className="mt-3"><NewsletterForm /></div>
          </Card>

          <Card title="Early-access testers">
            Try tiny tools before they’re public. I want blunt, kind feedback.
            <div className="mt-3"><WaitlistForm label="Join early-access waitlist" tag="ea" /></div>
          </Card>

          <Card title="Feedback & ideas">
            Have a clunky workflow? Tell me. If it’s small and clear, I might build it.
            <div className="mt-3">
              <a
                className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400 text-sm"
                href="mailto:hello@pablorivera.dev?subject=Explorer%20Lab%20Idea"
              >
                Email an idea
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* ETHOS */}
      <section aria-labelledby="ethos" className="space-y-3">
        <h2 id="ethos" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
          Ethos
        </h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {[
            ['Clarity first', 'Plain language, short demos, honest trade-offs.'],
            ['Tight loops', 'Ship small, learn fast, document decisions.'],
            ['Kind candor', 'Challenge ideas, not people. Direct but respectful.'],
          ].map(([title, body]) => (
            <li key={title} className="rounded-xl border border-stone-800 bg-stone-900/40 p-4">
              <div className="font-medium text-stone-100 flex items-center gap-2">
                <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
                {title}
              </div>
              <p className="text-sm text-stone-300 mt-1">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="space-y-4">
        <h2 id="faq" className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
          <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
          FAQ
        </h2>
        <div className="space-y-2">
          <Faq q="How often is the newsletter?">
            Irregular but thoughtful — only when there’s something worth your time.
          </Faq>
          <Faq q="What do early-access testers do?">
            You’ll get links to small prototypes. Kick the tires; tell me what’s confusing or slow.
          </Faq>
          <Faq q="Will this be open source?">
            Some things, yes. Others will be write-ups. I share what’s most useful.
          </Faq>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-stone-800 bg-stone-900/40 p-5">
        <h2 className="text-xl font-semibold text-stone-100">Start anywhere</h2>
        <p className="text-stone-300 text-sm mt-1">
          Not sure where to click? Browse a project, then reply with one thing that could be clearer.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <Link className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400" to="/projects">
            See projects
          </Link>
          <a className="underline decoration-emerald-500/50 underline-offset-4 hover:decoration-emerald-400" href="mailto:hello@pablorivera.dev">
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
      className="rounded-xl border border-stone-800 bg-stone-900/40 p-4"
    >
      <h3 className="font-semibold text-stone-100">{title}</h3>
      <div className="text-sm text-stone-300 mt-1">{children}</div>
    </motion.article>
  )
}

/** Newsletter form → Supabase insert */
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
    const isEmail = /\S+@\S+\.\S+/.test(value)
    if (!isEmail) {
      setStatus('err')
      setErrMsg('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    const { error } = await supabase
  .from('newsletter_signups')
  .insert([{ email: value, user_agent: navigator.userAgent }])

    if (error) {
      console.error('Supabase insert error (newsletter):', error)
      if ((error as any).code === '23505') {
        setStatus('dup')
      } else {
        setStatus('err')
        setErrMsg(error.message || 'Something went wrong. Please try again.')
      }
      return
    }

    setStatus('ok')
    setEmail('')
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
        className="min-w-0 flex-1 rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                   placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
      />
      <button
        type="submit"
        className="rounded-lg bg-emerald-400 text-black px-3 py-2 text-sm font-medium hover:bg-emerald-300 transition
                   focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Joining…' : 'Join'}
      </button>

      <AnimatePresence>
        {status === 'ok' && (
          <motion.span initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -2 }}
            className="self-center text-xs text-emerald-400">
            You’re in. Thanks!
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

/** Early-access form → Supabase insert */
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
    const isEmail = /\S+@\S+\.\S+/.test(value)
    if (!isEmail) {
      setStatus('err')
      setErrMsg('Please enter a valid email address.')
      return
    }

    setStatus('loading')
    const { error } = await supabase
  .from('early_access_waitlist')
  .insert([{ email: value, notes, tag, user_agent: navigator.userAgent }])

    if (error) {
      console.error('Supabase insert error (waitlist):', error)
      if ((error as any).code === '23505') {
        setStatus('dup')
      } else {
        setStatus('err')
        setErrMsg(error.message || 'Something went wrong. Please try again.')
      }
      return
    }

    setStatus('ok')
    setEmail('')
    setNotes('')
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
        className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                   placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
      />
      <textarea
        value={notes}
        onChange={e => { setNotes(e.target.value); if (status !== 'idle') { setStatus('idle'); setErrMsg('') } }}
        placeholder="What kinds of tools would you like to test?"
        rows={2}
        className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                   placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
      />
      <button
        type="submit"
        className="rounded-lg border border-stone-700 px-3 py-2 text-sm text-stone-200 hover:border-emerald-500/50 hover:bg-stone-900 transition
                   focus:outline-none focus:ring-2 focus:ring-emerald-500/60 disabled:opacity-60"
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
    <div className="rounded-xl border border-stone-800 bg-stone-900/40">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 text-left font-medium text-stone-100 hover:bg-stone-900/60
                   focus:outline-none focus:ring-2 focus:ring-emerald-500/60 rounded-xl"
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