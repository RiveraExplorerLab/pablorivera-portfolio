// src/hooks/useCommunitySignups.ts
import { useEffect, useState } from 'react'
import { getActiveSignups, getSignupsByType } from '../lib/communitySignups'
import type { CommunitySignup } from '../lib/types'

/**
 * Hook to fetch all active signups (admin)
 */
export function useSignups() {
  const [data, setData] = useState<CommunitySignup[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const signups = await getActiveSignups()
      setData(signups)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load signups')
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
 * Hook to fetch newsletter signups (admin)
 */
export function useNewsletterSignups() {
  const [data, setData] = useState<CommunitySignup[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const signups = await getSignupsByType('newsletter')
      setData(signups)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load newsletter signups')
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
 * Hook to fetch early access signups (admin)
 */
export function useEarlyAccessSignups() {
  const [data, setData] = useState<CommunitySignup[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const signups = await getSignupsByType('early-access')
      setData(signups)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load early access signups')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  return { data, loading, error, reload }
}
