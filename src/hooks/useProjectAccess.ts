// src/hooks/useProjectAccess.ts
import { useEffect, useState } from 'react'
import { 
  getActiveAccess, 
  getAllAccess,
  getAccessByProject,
  getAccessByEmail 
} from '../lib/projectAccess'
import type { ProjectAccess } from '../lib/types'

/**
 * Hook to fetch all active access grants (admin)
 */
export function useActiveAccess() {
  const [data, setData] = useState<ProjectAccess[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const access = await getActiveAccess()
      setData(access)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load access grants')
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
 * Hook to fetch all access grants including revoked/expired (admin)
 */
export function useAllAccess() {
  const [data, setData] = useState<ProjectAccess[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const access = await getAllAccess()
      setData(access)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load access history')
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
 * Hook to fetch access grants for a specific project (admin)
 */
export function useProjectAccess(projectId: string) {
  const [data, setData] = useState<ProjectAccess[] | null>(null)
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
      const access = await getAccessByProject(projectId)
      setData(access)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load project access')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [projectId])

  return { data, loading, error, reload }
}

/**
 * Hook to fetch access grants for a specific email (admin)
 */
export function useUserAccess(email: string) {
  const [data, setData] = useState<ProjectAccess[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    if (!email) {
      setData([])
      setLoading(false)
      return
    }

    setLoading(true)
    try {
      const access = await getAccessByEmail(email)
      setData(access)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user access')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [email])

  return { data, loading, error, reload }
}
