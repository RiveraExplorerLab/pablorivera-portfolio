// src/routes/AdminAccess.tsx
import { useState, useMemo } from 'react'
import { Navigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../providers/AuthProvider'
import { useAccessRequests } from '../hooks/useAccessRequests'
import { useActiveAccess } from '../hooks/useProjectAccess'
import { updateRequestStatus, softDeleteRequest } from '../lib/accessRequests'
import { grantAccess, revokeAccess } from '../lib/projectAccess'
import type { AccessRequest, ProjectAccess } from '../lib/types'

export default function AdminAccess() {
  const { user, isAdmin, loading } = useAuth()
  const [tab, setTab] = useState<'requests' | 'granted'>('requests')

  if (loading) return <p className="text-stone-400 text-sm">Checking session…</p>
  if (!user || !isAdmin) return <Navigate to="/login" replace />

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <header className="flex items-center gap-3">
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
          Access Management
        </h1>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10">
        {[
          { key: 'requests', label: 'Access Requests' },
          { key: 'granted', label: 'Granted Access' },
        ].map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key as typeof tab)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-all duration-300 ${
              tab === t.key
                ? 'border-teal-400 text-teal-400'
                : 'border-transparent text-stone-400 hover:text-stone-200 hover:border-white/20'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.15 }}
        >
          {tab === 'requests' ? <RequestsTab /> : <GrantedTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

/* ==================== REQUESTS TAB ==================== */

function RequestsTab() {
  const { user } = useAuth()
  const { data: requests, loading, error, reload } = useAccessRequests()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('pending')
  const [processingId, setProcessingId] = useState<string | null>(null)

  const filteredRequests = useMemo(() => {
    if (!requests) return []
    if (filter === 'all') return requests
    return requests.filter(r => r.status === filter)
  }, [requests, filter])

  const counts = useMemo(() => {
    if (!requests) return { pending: 0, approved: 0, denied: 0 }
    return {
      pending: requests.filter(r => r.status === 'pending').length,
      approved: requests.filter(r => r.status === 'approved').length,
      denied: requests.filter(r => r.status === 'denied').length,
    }
  }, [requests])

  async function handleApprove(request: AccessRequest, expirationDays?: number) {
    setProcessingId(request.id)
    
    try {
      await updateRequestStatus(request.id, 'approved')
      
      const expiresAt = expirationDays 
        ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000)
        : null
      
      await grantAccess(
        request.email,
        request.name,
        request.projectId,
        request.projectSlug,
        request.projectTitle,
        user?.email || 'admin',
        expiresAt,
        request.id
      )
      
      reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to approve')
    } finally {
      setProcessingId(null)
    }
  }

  async function handleDeny(request: AccessRequest, note?: string) {
    setProcessingId(request.id)
    
    try {
      await updateRequestStatus(request.id, 'denied', note)
      reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to deny')
    } finally {
      setProcessingId(null)
    }
  }

  async function handleDelete(request: AccessRequest) {
    if (!confirm(`Delete this request from ${request.email}?`)) return
    
    try {
      await softDeleteRequest(request.id)
      reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete')
    }
  }

  return (
    <div className="space-y-4">
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {[
          { key: 'pending', label: 'Pending', count: counts.pending, color: 'amber' },
          { key: 'approved', label: 'Approved', count: counts.approved, color: 'teal' },
          { key: 'denied', label: 'Denied', count: counts.denied, color: 'rose' },
          { key: 'all', label: 'All', count: requests?.length || 0, color: 'stone' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key as typeof filter)}
            className={`px-3 py-1.5 text-sm rounded-lg transition-all duration-300 ${
              filter === tab.key
                ? tab.color === 'amber' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : tab.color === 'teal' ? 'bg-teal-500/20 text-teal-400 border border-teal-500/30'
                : tab.color === 'rose' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                : 'bg-stone-700/50 text-stone-300 border border-stone-600'
                : 'text-stone-400 hover:text-stone-200 hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* Requests list */}
      {loading ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : error ? (
        <p className="text-rose-400 text-sm">Error: {error}</p>
      ) : !filteredRequests.length ? (
        <div className="card p-8 text-center">
          <p className="text-stone-400">No requests found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <RequestCard
                request={request}
                processing={processingId === request.id}
                onApprove={handleApprove}
                onDeny={handleDeny}
                onDelete={handleDelete}
              />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

function RequestCard({
  request,
  processing,
  onApprove,
  onDeny,
  onDelete,
}: {
  request: AccessRequest
  processing: boolean
  onApprove: (request: AccessRequest, expirationDays?: number) => void
  onDeny: (request: AccessRequest, note?: string) => void
  onDelete: (request: AccessRequest) => void
}) {
  const [showActions, setShowActions] = useState(false)
  const [expirationDays, setExpirationDays] = useState<string>('')
  const [denyNote, setDenyNote] = useState('')

  const statusConfig = {
    pending: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20' },
    approved: { bg: 'bg-teal-500/10', text: 'text-teal-400', border: 'border-teal-500/20' },
    denied: { bg: 'bg-rose-500/10', text: 'text-rose-400', border: 'border-rose-500/20' },
  }

  const status = statusConfig[request.status]

  return (
    <div className="card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-stone-100">{request.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${status.bg} ${status.text} border ${status.border}`}>
              {request.status}
            </span>
          </div>
          <div className="text-sm text-stone-400">{request.email}</div>
          <div className="text-sm">
            <span className="text-stone-500">Project:</span>{' '}
            <span className="text-teal-400">{request.projectTitle}</span>
          </div>
          <div className="text-sm text-stone-300 mt-3 p-3 rounded-lg bg-white/5 border border-white/10">
            {request.message}
          </div>
          <div className="text-xs text-stone-500 pt-2">
            Requested {formatDate(request.createdAt.toDate())}
          </div>
        </div>

        {request.status === 'pending' && (
          <button
            onClick={() => setShowActions(!showActions)}
            className="btn-secondary text-xs py-1.5"
          >
            {showActions ? 'Hide' : 'Actions'}
          </button>
        )}
      </div>

      {/* Action panel for pending requests */}
      <AnimatePresence>
        {showActions && request.status === 'pending' && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-white/10 space-y-4 overflow-hidden"
          >
            {/* Approve section */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1">
                <label className="text-xs text-stone-400 block mb-1">
                  Expiration (days, leave empty for permanent)
                </label>
                <input
                  type="number"
                  min="1"
                  value={expirationDays}
                  onChange={(e) => setExpirationDays(e.target.value)}
                  placeholder="e.g. 30"
                  className="input"
                />
              </div>
              <button
                onClick={() => onApprove(request, expirationDays ? parseInt(expirationDays) : undefined)}
                disabled={processing}
                className="btn-primary disabled:opacity-60"
              >
                <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {processing ? 'Processing…' : 'Approve'}
              </button>
            </div>

            {/* Deny section */}
            <div className="flex flex-col sm:flex-row sm:items-end gap-3">
              <div className="flex-1">
                <label className="text-xs text-stone-400 block mb-1">
                  Reason (internal note)
                </label>
                <input
                  type="text"
                  value={denyNote}
                  onChange={(e) => setDenyNote(e.target.value)}
                  placeholder="Optional note"
                  className="input"
                />
              </div>
              <button
                onClick={() => onDeny(request, denyNote)}
                disabled={processing}
                className="px-4 py-2 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20 
                           hover:bg-rose-500/20 transition-colors text-sm font-medium disabled:opacity-60"
              >
                <svg className="w-4 h-4 mr-1.5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
                Deny
              </button>
            </div>

            {/* Delete */}
            <button
              onClick={() => onDelete(request)}
              className="text-xs text-stone-500 hover:text-rose-400 transition-colors"
            >
              Delete request permanently
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Admin note for processed requests */}
      {request.adminNote && request.status !== 'pending' && (
        <div className="mt-3 pt-3 border-t border-white/10 text-xs text-stone-500">
          <span className="text-stone-600">Admin note:</span> {request.adminNote}
        </div>
      )}
    </div>
  )
}

/* ==================== GRANTED TAB ==================== */

function GrantedTab() {
  const { user } = useAuth()
  const { data: accessList, loading, error, reload } = useActiveAccess()
  const [search, setSearch] = useState('')

  const filteredAccess = useMemo(() => {
    if (!accessList) return []
    const term = search.trim().toLowerCase()
    if (!term) return accessList
    return accessList.filter(a => 
      a.email.toLowerCase().includes(term) ||
      a.name.toLowerCase().includes(term) ||
      a.projectTitle.toLowerCase().includes(term)
    )
  }, [accessList, search])

  async function handleRevoke(access: ProjectAccess) {
    if (!confirm(`Revoke ${access.email}'s access to ${access.projectTitle}?`)) return
    
    try {
      await revokeAccess(access.id, user?.email || 'admin')
      reload()
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to revoke')
    }
  }

  return (
    <div className="space-y-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, or project…"
        className="input max-w-md"
      />

      {loading ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : error ? (
        <p className="text-rose-400 text-sm">Error: {error}</p>
      ) : !filteredAccess.length ? (
        <div className="card p-8 text-center">
          <p className="text-stone-400">No active access grants.</p>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b border-white/10">
                <tr className="text-stone-400 text-xs uppercase tracking-wider">
                  <th className="text-left px-4 py-3 font-medium">User</th>
                  <th className="text-left px-4 py-3 font-medium">Project</th>
                  <th className="text-left px-4 py-3 font-medium">Granted</th>
                  <th className="text-left px-4 py-3 font-medium">Expires</th>
                  <th className="text-left px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredAccess.map((access, index) => (
                  <motion.tr 
                    key={access.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.02 }}
                    className="text-stone-200 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium">{access.name}</div>
                      <div className="text-xs text-stone-400">{access.email}</div>
                    </td>
                    <td className="px-4 py-3 text-teal-400">{access.projectTitle}</td>
                    <td className="px-4 py-3 text-stone-400 text-xs">
                      {formatDate(access.grantedAt.toDate())}
                    </td>
                    <td className="px-4 py-3">
                      {access.expiresAt ? (
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isExpiringSoon(access.expiresAt.toDate()) 
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                            : 'text-stone-400'
                        }`}>
                          {formatDate(access.expiresAt.toDate())}
                        </span>
                      ) : (
                        <span className="text-xs text-stone-500">Never</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleRevoke(access)}
                        className="text-xs text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        Revoke
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

/* ==================== HELPERS ==================== */

function formatDate(date: Date): string {
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  })
}

function isExpiringSoon(date: Date): boolean {
  const threeDays = 3 * 24 * 60 * 60 * 1000
  return date.getTime() - Date.now() < threeDays
}
