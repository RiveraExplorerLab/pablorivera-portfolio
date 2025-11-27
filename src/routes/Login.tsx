// src/routes/Login.tsx
import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../providers/AuthProvider'

export default function Login() {
  const { user, isAdmin, loading, signIn } = useAuth()
  const navigate = useNavigate()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // If already logged in as admin, redirect to admin
  if (!loading && user && isAdmin) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      // Make error messages more user-friendly
      if (message.includes('auth/invalid-credential')) {
        setError('Invalid email or password')
      } else if (message.includes('auth/user-not-found')) {
        setError('No account found with this email')
      } else if (message.includes('auth/wrong-password')) {
        setError('Incorrect password')
      } else if (message.includes('auth/too-many-requests')) {
        setError('Too many failed attempts. Please try again later.')
      } else {
        setError(message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return <p className="text-stone-400 text-sm">Loading…</p>
  }

  return (
    <div className="max-w-sm mx-auto space-y-4">
      <h1 className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
        <span className="inline-block size-1.5 rounded-full bg-emerald-400" />
        Admin Sign In
      </h1>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="email" className="sr-only">Email</label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                       placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          />
        </div>
        
        <div>
          <label htmlFor="password" className="sr-only">Password</label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                       placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-emerald-400 text-black px-3 py-2 text-sm font-medium 
                     hover:bg-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                     disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting ? 'Signing in…' : 'Sign In'}
        </button>

        {error && (
          <p className="text-sm text-rose-400 bg-rose-400/10 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </form>
    </div>
  )
}
