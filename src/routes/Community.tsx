// src/routes/Community.tsx
import { useState } from 'react'
import type { FormEvent } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function Community() {
  return (
    <div className="space-y-12">
      {/* HERO */}
      <section className="space-y-4">
        <motion.h1
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="text-4xl md:text-5xl font-bold tracking-tight"
        >
          Community
        </motion.h1>
        <p className="max-w-2xl text-neutral-300">
          Explorer Lab is a place for small, sharp experiments. If you like simple
          tools that reduce friction—and honest write-ups about what worked and what didn’t—this is for you.
        </p>
      </section>

      {/* WAYS TO JOIN */}
      <section aria-labelledby="join" className="space-y-4">
        <h2 id="join" className="text-2xl font-semibold">Ways to join</h2>
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
                className="underline text-sm"
                href="mailto:hello@pablorivera.dev?subject=Explorer%20Lab%20Idea"
              >
                Email an idea
              </a>
            </div>
          </Card>
        </div>
      </section>

      {/* CODE OF CONDUCT / ETHOS */}
      <section aria-labelledby="ethos" className="space-y-3">
        <h2 id="ethos" className="text-2xl font-semibold">Ethos</h2>
        <ul className="grid gap-3 md:grid-cols-3">
          {[
            ['Clarity first', 'Plain language, short demos, honest trade-offs.'],
            ['Tight loops', 'Ship small, learn fast, document decisions.'],
            ['Kind candor', 'Challenge ideas, not people. Direct but respectful.'],
          ].map(([title, body]) => (
            <li key={title} className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4">
              <div className="font-medium">{title}</div>
              <p className="text-sm text-neutral-300 mt-1">{body}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq" className="space-y-4">
        <h2 id="faq" className="text-2xl font-semibold">FAQ</h2>
        <div className="space-y-2">
          <Faq q="How often is the newsletter?">
            Irregular but thoughtful—only when there’s something worth your time.
          </Faq>
          <Faq q="What do early-access testers do?">
            You’ll get links to small prototypes. Kick the tires, tell me what’s confusing or slow.
          </Faq>
          <Faq q="Will this be open source?">
            Some things, yes. Others will be write-ups. I share what’s most useful.
          </Faq>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-5">
        <h2 className="text-xl font-semibold">Start anywhere</h2>
        <p className="text-neutral-300 text-sm mt-1">
          Not sure where to click? Browse a project, then reply with one thing that could be clearer.
        </p>
        <div className="mt-3 flex flex-wrap gap-4 text-sm">
          <Link className="underline" to="/projects">See projects</Link>
          <a className="underline" href="mailto:hello@pablorivera.dev">Email me</a>
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
      className="rounded-xl border border-neutral-800 bg-neutral-900/40 p-4"
    >
      <h3 className="font-semibold">{title}</h3>
      <div className="text-sm text-neutral-300 mt-1">{children}</div>
    </motion.article>
  )
}

/** Lightweight email form: client-only for now.
 *  Replace `fakeSubmit` with a real endpoint later (Supabase/Resend/etc).
 */
function NewsletterForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'ok' | 'err' | 'loading'>('idle')

  function fakeSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return setStatus('err')
    setStatus('loading')
    setTimeout(() => setStatus('ok'), 600) // simulate request
  }

  return (
    <form onSubmit={fakeSubmit} className="flex gap-2">
      <label htmlFor="nl" className="sr-only">Email</label>
      <input
        id="nl"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        value={email}
        onChange={e => { setEmail(e.target.value); if (status !== 'idle') setStatus('idle') }}
        placeholder="you@example.com"
        className="min-w-0 flex-1 rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm
                   focus-visible:outline-none focus-visible:ring-2"
      />
      <button
        type="submit"
        className="rounded-lg bg-white text-black px-3 py-2 text-sm font-medium hover:bg-neutral-200 transition
                   disabled:opacity-60"
        disabled={status === 'loading'}
      >
        {status === 'loading' ? 'Joining…' : 'Join'}
      </button>
      <AnimatePresence>
        {status === 'ok' && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            className="self-center text-xs text-green-400"
          >
            You’re in. (Local only—wire backend later.)
          </motion.span>
        )}
        {status === 'err' && (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -2 }}
            className="self-center text-xs text-rose-400"
          >
            Enter a valid email.
          </motion.span>
        )}
      </AnimatePresence>
    </form>
  )
}

function WaitlistForm({ label, tag }: { label: string; tag: string }) {
  const [email, setEmail] = useState('')
  const [notes, setNotes] = useState('')
  const [ok, setOk] = useState(false)

  function fakeSubmit(e: FormEvent) {
    e.preventDefault()
    if (!email.includes('@')) return
    // In the future: POST { email, notes, tag } to your API
    setOk(true)
  }

  return (
    <form onSubmit={fakeSubmit} className="space-y-2">
      <label htmlFor={`wl-${tag}`} className="sr-only">Email</label>
      <input
        id={`wl-${tag}`}
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm
                   focus-visible:outline-none focus-visible:ring-2"
      />
      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="What kinds of tools would you like to test?"
        rows={2}
        className="w-full rounded-lg border border-neutral-800 bg-neutral-900/50 px-3 py-2 text-sm
                   focus-visible:outline-none focus-visible:ring-2"
      />
      <button
        type="submit"
        className="rounded-lg border border-neutral-700 px-3 py-2 text-sm hover:bg-neutral-900 transition"
      >
        {ok ? 'Thanks — added (local only)' : label}
      </button>
    </form>
  )
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/40">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full px-4 py-3 text-left font-medium hover:bg-neutral-900/60
                   focus-visible:outline-none focus-visible:ring-2 rounded-xl"
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
            className="px-4 pb-4 text-sm text-neutral-300"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}