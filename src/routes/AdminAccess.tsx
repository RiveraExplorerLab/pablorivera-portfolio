// src/routes/AdminAccess.tsx
import { useState, useMemo } from 'react'
import { Navigate, Link } from 'react-router-dom'
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
    <div className="space-y-6 max-w-5xl">
      <header className="flex items-center gap-3">
        <Link to="/admin" className="text-stone-400 hover:text-stone-200">
          ← Admin
        </Link>
        <h1 className="text-2xl font-semibold text-stone-100">Access Management</h1>
      </header>

      {/* Tabs */}
      <div className="inline-flex rounded-lg border border-stone-800 overflow-hidden">
        <button
          onClick={() => setTab('requests')}
          className={`px-3 py-1.5 text-sm ${tab === 'requests' ? 'bg-emerald-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
        >
          Access Requests
        </button>
        <button
          onClick={() => setTab('granted')}
          className={`px-3 py-1.5 text-sm ${tab === 'granted' ? 'bg-emerald-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
        >
          Granted Access
        </button>
      </div>

      {tab === 'requests' ? <RequestsTab /> : <GrantedTab />}
    </div>
  )
}

/* ==================== REQUESTS TAB ==================== */

function RequestsTab() {
  const { user } = useAuth()
  const { data: requests, loading, error, reload } = useAccessRequests()
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'denied'>('pending')
  const [processingId, setProcessingId] = useState<string | null>(null)

  // Filter requests
  const filteredRequests = useMemo(() => {
    if (!requests) return []
    if (filter === 'all') return requests
    return requests.filter(r => r.status === filter)
  }, [requests, filter])

  // Count by status
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
      // Update request status
      await updateRequestStatus(request.id, 'approved')
      
      // Grant access
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
      <div className="inline-flex rounded-lg border border-stone-800 overflow-hidden">
        <button
          onClick={() => setFilter('pending')}
          className={`px-3 py-1.5 text-sm ${filter === 'pending' ? 'bg-amber-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
        >
          Pending ({counts.pending})
        </button>
        <button
          onClick={() => setFilter('approved')}
          className={`px-3 py-1.5 text-sm ${filter === 'approved' ? 'bg-emerald-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
        >
          Approved ({counts.approved})
        </button>
        <button
          onClick={() => setFilter('denied')}
          className={`px-3 py-1.5 text-sm ${filter === 'denied' ? 'bg-rose-400 text-black' : 'text-stone-200 hover:bg-stone-900'}`}
        >
          Denied ({counts.denied})
        </button>
        <button
          onClick={() => setFilter('all')}
          className={`px-3 py-1.5 text-sm ${filter === 'all' ? 'bg-stone-600 text-white' : 'text-stone-200 hover:bg-stone-900'}`}
        >
          All
        </button>
      </div>

      {/* Requests list */}
      {loading ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : error ? (
        <p className="text-rose-400 text-sm">Error: {error}</p>
      ) : !filteredRequests.length ? (
        <p className="text-stone-400 text-sm">No requests found.</p>
      ) : (
        <div className="space-y-3">
          {filteredRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              processing={processingId === request.id}
              onApprove={handleApprove}
              onDeny={handleDeny}
              onDelete={handleDelete}
            />
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

  const statusColors = {
    pending: 'bg-amber-500/20 text-amber-400',
    approved: 'bg-emerald-500/20 text-emerald-400',
    denied: 'bg-rose-500/20 text-rose-400',
  }

  return (
    <div className="rounded-lg border border-stone-800 bg-stone-900/40 p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-stone-100">{request.name}</span>
            <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[request.status]}`}>
              {request.status}
            </span>
          </div>
          <div className="text-sm text-stone-400">{request.email}</div>
          <div className="text-sm">
            <span className="text-stone-500">Project:</span>{' '}
            <span className="text-stone-300">{request.projectTitle}</span>
          </div>
          <div className="text-sm text-stone-400 mt-2">
            <span className="text-stone-500">Message:</span>{' '}
            {request.message}
          </div>
          <div className="text-xs text-stone-500 mt-2">
            Requested {formatDate(request.createdAt.toDate())}
          </div>
        </div>

        {request.status === 'pending' && (
          <button
            onClick={() => setShowActions(!showActions)}
            className="text-sm text-stone-400 hover:text-stone-200"
          >
            {showActions ? 'Hide' : 'Actions'}
          </button>
        )}
      </div>

      {/* Action panel for pending requests */}
      {showActions && request.status === 'pending' && (
        <div className="mt-4 pt-4 border-t border-stone-800 space-y-3">
          {/* Approve section */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-stone-500 block mb-1">
                Expiration (days, leave empty for no expiration)
              </label>
              <input
                type="number"
                min="1"
                value={expirationDays}
                onChange={(e) => setExpirationDays(e.target.value)}
                placeholder="e.g. 30"
                className="w-full rounded border border-stone-700 bg-stone-800 px-2 py-1 text-sm text-stone-100"
              />
            </div>
            <button
              onClick={() => onApprove(request, expirationDays ? parseInt(expirationDays) : undefined)}
              disabled={processing}
              className="rounded bg-emerald-500 text-black px-3 py-1.5 text-sm font-medium hover:bg-emerald-400 disabled:opacity-60"
            >
              {processing ? 'Processing…' : 'Approve'}
            </button>
          </div>

          {/* Deny section */}
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <label className="text-xs text-stone-500 block mb-1">
                Reason (internal note)
              </label>
              <input
                type="text"
                value={denyNote}
                onChange={(e) => setDenyNote(e.target.value)}
                placeholder="Optional note"
                className="w-full rounded border border-stone-700 bg-stone-800 px-2 py-1 text-sm text-stone-100"
              />
            </div>
            <button
              onClick={() => onDeny(request, denyNote)}
              disabled={processing}
              className="rounded bg-rose-500 text-white px-3 py-1.5 text-sm font-medium hover:bg-rose-400 disabled:opacity-60"
            >
              Deny
            </button>
          </div>

          {/* Delete */}
          <button
            onClick={() => onDelete(request)}
            className="text-xs text-stone-500 hover:text-rose-400"
          >
            Delete request
          </button>
        </div>
      )}

      {/* Admin note for processed requests */}
      {request.adminNote && request.status !== 'pending' && (
        <div className="mt-2 text-xs text-stone-500">
          <span className="text-stone-600">Note:</span> {request.adminNote}
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

  async function handleRevoke(access: ProjectAccess, reason?: string) {
    if (!confirm(`Revoke ${access.email}'s access to ${access.projectTitle}?`)) return
    
    try {
      await revokeAccess(access.id, user?.email || 'admin', reason)
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
        className="w-full max-w-md rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                   placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
      />

      {loading ? (
        <p className="text-stone-400 text-sm">Loading…</p>
      ) : error ? (
        <p className="text-rose-400 text-sm">Error: {error}</p>
      ) : !filteredAccess.length ? (
        <p className="text-stone-400 text-sm">No active access grants.</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-stone-800">
          <table className="min-w-full text-sm">
            <thead className="bg-stone-900/60 text-stone-300">
              <tr>
                <th className="text-left px-3 py-2">User</th>
                <th className="text-left px-3 py-2">Project</th>
                <th className="text-left px-3 py-2">Granted</th>
                <th className="text-left px-3 py-2">Expires</th>
                <th className="text-left px-3 py-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800 text-stone-200">
              {filteredAccess.map((access) => (
                <tr key={access.id}>
                  <td className="px-3 py-2">
                    <div className="font-medium">{access.name}</div>
                    <div className="text-xs text-stone-400">{access.email}</div>
                  </td>
                  <td className="px-3 py-2">{access.projectTitle}</td>
                  <td className="px-3 py-2 text-stone-400">
                    {formatDate(access.grantedAt.toDate())}
                  </td>
                  <td className="px-3 py-2">
                    {access.expiresAt ? (
                      <span className={isExpiringSoon(access.expiresAt.toDate()) ? 'text-amber-400' : 'text-stone-400'}>
                        {formatDate(access.expiresAt.toDate())}
                      </span>
                    ) : (
                      <span className="text-stone-500">Never</span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    <button
                      onClick={() => handleRevoke(access)}
                      className="text-xs text-rose-400 hover:text-rose-300"
                    >
                      Revoke
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
