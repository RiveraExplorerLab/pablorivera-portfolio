// src/hooks/useBlogPosts.ts
import { useEffect, useState } from 'react'
import { getPublishedPosts, getPostBySlug, getAllPosts } from '../lib/blogPosts'
import type { BlogPost } from '../lib/types'

/**
 * Hook to fetch published blog posts (public)
 */
export function usePosts(maxResults = 30) {
  const [data, setData] = useState<BlogPost[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function fetchPosts() {
      try {
        const posts = await getPublishedPosts(maxResults)
        if (!cancelled) {
          setData(posts)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load posts')
          setLoading(false)
        }
      }
    }

    fetchPosts()
    return () => { cancelled = true }
  }, [maxResults])

  return { data, loading, error }
}

/**
 * Hook to fetch a single post by slug (public)
 */
export function usePost(slug: string) {
  const [data, setData] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) {
      setLoading(false)
      return
    }

    let cancelled = false

    async function fetchPost() {
      try {
        const post = await getPostBySlug(slug)
        if (!cancelled) {
          setData(post)
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load post')
          setLoading(false)
        }
      }
    }

    fetchPost()
    return () => { cancelled = true }
  }, [slug])

  return { data, loading, error }
}

/**
 * Hook to fetch all posts including drafts (admin)
 */
export function useAllPosts() {
  const [data, setData] = useState<BlogPost[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  async function reload() {
    setLoading(true)
    try {
      const posts = await getAllPosts()
      setData(posts)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    reload()
  }, [])

  return { data, loading, error, reload }
}
