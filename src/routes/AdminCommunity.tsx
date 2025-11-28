// src/routes/AdminCommunity.tsx
import { useState, useMemo } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../providers/AuthProvider'
import { useSignups } from '../hooks/useCommunitySignups'
import { softDeleteSignup } from '../lib/communitySignups'
import { downloadCsv } from '../helpers/export'
import type { CommunitySignup } from '../lib/types'

export default function AdminCommunity() {
  const { user, isAdmin, loading } = useAuth()
  const { data: signups, loading: loadingSignups, error, reload } = useSignups()
  const [filter, setFilter] = useState<'all' | 'newsletter' | 'early-access'>('all')
  const [search, setSearch] = useState('')

  if (loading) return <p className="text-stone-400 text-sm">Checking session…</p>
  if (!user || !isAdmin) return <Navigate to="/login" replace />

  // Filter signups
  const filteredSignups = useMemo(() => {
    if (!signups) return []
    
    let result = signups
    
    if (filter !== 'all') {
      result = result.filter(s => s.type === filter)
    }
    
    const term = search.trim().toLowerCase()
    if (term) {
      result = result.filter(s => 
        s.email.toLowerCase().includes(term) ||
        (s.notes?.toLowerCase().includes(term))
      )
    }
    
    return result
  }, [signups, filter, search])

  const newsletterSignups = useMemo(() => 
    signups?.filter(s => s.type === 'newsletter') || [], 
    [signups]
  )
  const earlyAccessSignups = useMemo(() => 
    signups?.filter(s => s.type === 'early-access') || [], 
    [signups]
  )

  async function handleDelete(signup: CommunitySignup) {
    if (!confirm(`Remove ${signup.email} from ${signup.type}?`)) return
    
    try {
      await softDeleteSignup(signup.id)
      reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  function handleExportNewsletter() {
    const data = newsletterSignups.map(s => ({
      email: s.email,
      signed_up: s.createdAt.toDate().toISOString(),
    }))
    downloadCsv('newsletter-signups.csv', data)
  }

  function handleExportEarlyAccess() {
    const data = earlyAccessSignups.map(s => ({
      email: s.email,
      notes: s.notes || '',
      tag: s.tag || '',
      signed_up: s.createdAt.toDate().toISOString(),
    }))
    downloadCsv('early-access-signups.csv', data)
  }

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link 
            to="/admin" 
            className="text-teal-400 hover:text-teal-300 transition-colors text-sm inline-flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Admin
          </Link>
          <h1 className="text-2xl font-semibold text-stone-100 flex items-center gap-2">
            <span className="inline-block size-2 rounded-full bg-gradient-to-r from-teal-400 to-cyan-400" />
            Community Signups
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportNewsletter}
            disabled={!newsletterSignups.length}
            className="btn-primary text-xs py-1.5 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Newsletter ({newsletterSignups.length})
          </button>
          <button
            type="button"
            onClick={handleExportEarlyAccess}
            disabled={!earlyAccessSignups.length}
            className="btn-primary text-xs py-1.5 disabled:opacity-50"
          >
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Early Access ({earlyAccessSignups.length})
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex gap-1 border-b border-white/10 sm:border-0">
          {[
            { key: 'all', label: 'All', count: signups?.length || 0 },
            { key: 'newsletter', label: 'Newsletter', count: newsletterSignups.length },
            { key: 'early-access', label: 'Early Access', count: earlyAccessSignups.length },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key as typeof filter)}
              className={`px-4 py-2 text-sm font-medium border-b-2 sm:rounded-lg sm:border-0 transition-all duration-300 ${
                filter === tab.key
                  ? 'border-teal-400 text-teal-400 sm:bg-teal-500/10 sm:text-teal-400'
                  : 'border-transparent text-stone-400 hover:text-stone-200 sm:hover:bg-white/5'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or notes…"
          className="input flex-1 max-w-md"
        />
      </div>

      {/* Content */}
      {loadingSignups ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : error ? (
        <p className="text-rose-400 text-sm">Error: {error}</p>
      ) : !filteredSignups.length ? (
        <div className="card p-8 text-center">
          <p className="text-stone-400">No signups found.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-stone-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">Email</th>
                  <th className="text-left px-4 py-3 font-medium">Type</th>
                  <th className="text-left px-4 py-3 font-medium">Notes</th>
                  <th className="text-left px-4 py-3 font-medium">Signed Up</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSignups.map((signup, index) => (
                  <motion.tr 
                    key={signup.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="text-stone-200 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium">{signup.email}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        signup.type === 'newsletter' 
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' 
                          : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'
                      }`}>
                        {signup.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-w-xs truncate text-stone-400">
                      {signup.notes || '—'}
                    </td>
                    <td className="px-4 py-3 text-stone-400 text-xs">
                      {formatDate(signup.createdAt.toDate())}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleDelete(signup)}
                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  }) + ' ' + date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
