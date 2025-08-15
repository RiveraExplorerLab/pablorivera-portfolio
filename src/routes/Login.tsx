import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErr(null)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: window.location.origin + '/admin' },
    })
    if (error) setErr(error.message)
    else setSent(true)
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
        <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
        Admin sign in
      </h1>

      {!sent ? (
        <form onSubmit={onSubmit} className="space-y-2">
          <input
            type="email" required value={email} onChange={e=>setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                       placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          />
          <button
            type="submit"
            className="w-full rounded-lg bg-emerald-400 text-black px-3 py-2 text-sm font-medium hover:bg-emerald-300
                       focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          >
            Send magic link
          </button>
          {err && <p className="text-sm text-rose-400">{err}</p>}
        </form>
      ) : (
        <p className="text-stone-300 text-sm">
          Check your email — your sign-in link will return you to <span className="text-stone-100">/admin</span>.
        </p>
      )}
    </div>
  )
}