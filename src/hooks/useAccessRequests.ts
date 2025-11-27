// src/hooks/useAccessRequests.ts
import { useEffect, useState } from 'react'
import { 
  getAccessRequests, 
  getPendingRequests, 
  getRequestsByStatus,
  getRequestsByProject 
} from '../lib/accessRequests'
import type { AccessRequest, AccessRequestStatus } from '../lib/types'

/**
 * Hook to fetch all access requests (admin)
 */
export function useAccessRequests() {
  const [data, setData] = useState<AccessRequest[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const requests = await getAccessRequests()
      setData(requests)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load access requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  return { data, loading, error, reload }
}

/**
 * Hook to fetch pending access requests (admin)
 */
export function usePendingRequests() {
  const [data, setData] = useState<AccessRequest[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const requests = await getPendingRequests()
      setData(requests)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pending requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  return { data, loading, error, reload }
}

/**
 * Hook to fetch access requests by status (admin)
 */
export function useRequestsByStatus(status: AccessRequestStatus) {
  const [data, setData] = useState<AccessRequest[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const requests = await getRequestsByStatus(status)
      setData(requests)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [status])

  return { data, loading, error, reload }
}

/**
 * Hook to fetch access requests for a specific project (admin)
 */
export function useProjectRequests(projectId: string) {
  const [data, setData] = useState<AccessRequest[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    if (!projectId) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const requests = await getRequestsByProject(projectId)
      setData(requests)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project requests')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [projectId])

  return { data, loading, error, reload }
}
