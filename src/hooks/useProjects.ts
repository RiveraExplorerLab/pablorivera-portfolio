// src/hooks/useProjects.ts
import { useEffect, useState } from 'react'
import { 
  getPublishedProjects, 
  getProjectBySlug, 
  getAllProjects,
  getFeaturedProjects 
} from '../lib/projects'
import type { Project } from '../lib/types'

/**
 * Hook to fetch published projects (public)
 */
export function useProjects() {
  const [data, setData] = useState<Project[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchProjects() {
      try {
        const projects = await getPublishedProjects()
        if (!cancelled) {
          setData(projects)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load projects')
          setLoading(false)
        }
      }
    }

    fetchProjects()
    return () => { cancelled = true }
  }, [])

  return { data, loading, error }
}

/**
 * Hook to fetch featured projects (public)
 */
export function useFeaturedProjects(maxResults = 3) {
  const [data, setData] = useState<Project[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchFeatured() {
      try {
        const projects = await getFeaturedProjects(maxResults)
        if (!cancelled) {
          setData(projects)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load featured projects')
          setLoading(false)
        }
      }
    }

    fetchFeatured()
    return () => { cancelled = true }
  }, [maxResults])

  return { data, loading, error }
}

/**
 * Hook to fetch a single project by slug (public)
 */
export function useProject(slug: string) {
  const [data, setData] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchProject() {
      try {
        const project = await getProjectBySlug(slug)
        if (!cancelled) {
          setData(project)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load project')
          setLoading(false)
        }
      }
    }

    fetchProject()
    return () => { cancelled = true }
  }, [slug])

  return { data, loading, error }
}

/**
 * Hook to fetch all projects including drafts (admin)
 */
export function useAllProjects() {
  const [data, setData] = useState<Project[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const projects = await getAllProjects()
      setData(projects)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  return { data, loading, error, reload }
}
