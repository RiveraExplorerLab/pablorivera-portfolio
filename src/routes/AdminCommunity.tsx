// src/routes/AdminCommunity.tsx
import { useState, useMemo } from 'react'
import { Navigate, Link } from 'react-router-dom'
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
    
    // Filter by type
    if (filter !== 'all') {
      result = result.filter(s => s.type === filter)
    }
    
    // Filter by search
    const term = search.trim().toLowerCase()
    if (term) {
      result = result.filter(s => 
        s.email.toLowerCase().includes(term) ||
        (s.notes?.toLowerCase().includes(term))
      )
    }
    
    return result
  }, [signups, filter, search])

  // Separate for export
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
    <div className="space-y-6 max-w-5xl">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link 
            to="/admin" 
            className="text-stone-400 hover:text-stone-200"
          >
            ← Admin
          </Link>
          <h1 className="text-2xl font-semibold text-stone-100">Community Signups</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleExportNewsletter}
            disabled={!newsletterSignups.length}
            className="inline-flex items-center rounded-lg bg-emerald-400 text-black px-3 py-2 text-sm font-medium
                       hover:bg-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                       disabled:opacity-60"
          >
            Export Newsletter ({newsletterSignups.length})
          </button>
          <button
            type="button"
            onClick={handleExportEarlyAccess}
            disabled={!earlyAccessSignups.length}
            className="inline-flex items-center rounded-lg bg-emerald-400 text-black px-3 py-2 text-sm font-medium
                       hover:bg-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                       disabled:opacity-60"
          >
            Export Early Access ({earlyAccessSignups.length})
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="inline-flex rounded-lg border border-stone-800 overflow-hidden">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 text-sm ${filter === 'all' ? 'bg-emerald-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
          >
            All ({signups?.length || 0})
          </button>
          <button
            onClick={() => setFilter('newsletter')}
            className={`px-3 py-1.5 text-sm ${filter === 'newsletter' ? 'bg-emerald-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
          >
            Newsletter ({newsletterSignups.length})
          </button>
          <button
            onClick={() => setFilter('early-access')}
            className={`px-3 py-1.5 text-sm ${filter === 'early-access' ? 'bg-emerald-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
          >
            Early Access ({earlyAccessSignups.length})
          </button>
        </div>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by email or notes…"
          className="flex-1 max-w-md rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                     placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
        />
      </div>

      {/* Table */}
      {loadingSignups ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : error ? (
        <p className="text-rose-400 text-sm">Error: {error}</p>
      ) : !filteredSignups.length ? (
        <p className="text-stone-400 text-sm">No signups found.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-800">
          <table className="min-w-full text-sm">
            <thead className="bg-stone-900/60 text-stone-300">
              <tr>
                <th className="text-left px-3 py-2">Email</th>
                <th className="text-left px-3 py-2">Type</th>
                <th className="text-left px-3 py-2">Notes</th>
                <th className="text-left px-3 py-2">Signed Up</th>
                <th className="text-left px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-200">
              {filteredSignups.map((signup) => (
                <tr key={signup.id}>
                  <td className="px-3 py-2">{signup.email}</td>
                  <td className="px-3 py-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      signup.type === 'newsletter' 
                        ? 'bg-blue-500/20 text-blue-400' 
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {signup.type}
                    </span>
                  </td>
                  <td className="px-3 py-2 max-w-xs truncate text-stone-400">
                    {signup.notes || '—'}
                  </td>
                  <td className="px-3 py-2 text-stone-400">
                    {formatDate(signup.createdAt.toDate())}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleDelete(signup)}
                      className="text-xs text-rose-400 hover:text-rose-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
