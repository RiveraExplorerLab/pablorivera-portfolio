import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../providers/AuthProvider'
import { Navigate } from 'react-router-dom'
import { downloadCsv } from '../helpers/export'

type NS = { email: string; created_at: string; user_agent?: string | null }
type EA = { email: string; notes?: string | null; tag?: string | null; created_at: string; user_agent?: string | null }

export default function AdminCommunity() {
  const { user, loading } = useAuth()
  const [nl, setNl] = useState<NS[]>([])
  const [ea, setEa] = useState<EA[]>([])
  const [q, setQ] = useState('')

  useEffect(() => {
    (async () => {
      const [{ data: nlData }, { data: eaData }] = await Promise.all([
        supabase.from('newsletter_signups').select('email, created_at, user_agent').order('created_at', { ascending: false }),
        supabase.from('early_access_waitlist').select('email, notes, tag, created_at, user_agent').order('created_at', { ascending: false }),
      ])
      setNl(nlData || [])
      setEa(eaData || [])
    })()
  }, [])

  const nlFiltered = useMemo(() => filterBy(nl, q), [nl, q])
  const eaFiltered = useMemo(() => filterBy(ea, q), [ea, q])

  if (loading) return <p className="text-stone-400 text-sm">Checking session…</p>
  if (!user) return <Navigate to="/login" replace />

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
  <h1 className="text-2xl font-semibold text-stone-100">Community (admin)</h1>
  <div className="flex flex-wrap gap-2">
    <button
      type="button"
      onClick={() => downloadCsv('newsletter.csv', nlFiltered)}
      className="inline-flex items-center rounded-lg bg-emerald-400 text-black px-3 py-2 text-sm font-medium
                 hover:bg-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                 disabled:opacity-60"
      disabled={!nlFiltered.length}
    >
      Export newsletter CSV
    </button>

    <button
      type="button"
      onClick={() => downloadCsv('early-access.csv', eaFiltered)}
      className="inline-flex items-center rounded-lg bg-emerald-400 text-black px-3 py-2 text-sm font-medium
                 hover:bg-emerald-300 transition focus:outline-none focus:ring-2 focus:ring-emerald-500/60
                 disabled:opacity-60"
      disabled={!eaFiltered.length}
    >
      Export early-access CSV
    </button>
  </div>
</header>

      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Filter by email or note…"
          className="w-full max-w-md rounded-lg border border-stone-800 bg-stone-900/50 px-3 py-2 text-sm text-stone-100
                     placeholder:text-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/60"
        />
      </div>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-stone-100">Newsletter ({nlFiltered.length})</h2>
        <Table rows={nlFiltered} cols={[
          ['email','Email'], ['created_at','Signed up'],
        ]} />
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-semibold text-stone-100">Early-access ({eaFiltered.length})</h2>
        <Table rows={eaFiltered} cols={[
          ['email','Email'], ['tag','Tag'], ['notes','Notes'], ['created_at','Signed up'],
        ]} />
      </section>
    </div>
  )
}

function filterBy<T extends Record<string, any>>(rows: T[], q: string) {
  const t = q.trim().toLowerCase()
  if (!t) return rows
  return rows.filter(r =>
    Object.values(r).some(v => (v ?? '').toString().toLowerCase().includes(t))
  )
}

function Table({ rows, cols }:{ rows: any[]; cols: [keyof any,string][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-stone-800">
      <table className="min-w-full text-sm">
        <thead className="bg-stone-900/60 text-stone-300">
          <tr>
            {cols.map(([_, label]) => <th key={label} className="text-left px-3 py-2">{label}</th>)}
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-800 text-stone-200">
          {rows.map((r, i) => (
            <tr key={i}>
              {cols.map(([k]) => (
                <td key={String(k)} className="px-3 py-2 align-top">
                  {formatCell(r[k])}
                </td>
              ))}
            </tr>
          ))}
          {!rows.length && (
            <tr><td className="px-3 py-4 text-stone-400">No rows</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

function formatCell(v: any) {
  if (!v) return <span className="text-stone-500">—</span>
  // ISO-ish strings from Supabase: 2025-08-14T...
  if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
    return new Date(v).toLocaleString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    })
  }
  return String(v)
}