import { useEffect, useState } from 'react'
import { supabase } from './supabase'

export function usePosts(limit = 20) {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ok = true
    supabase.from('posts')
      .select('id,slug,title,summary,cover_url,published_at,created_at')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(limit)
      .then(({ data, error }) => {
        if (!ok) return
        if (error) setError(error.message)
        setData(data ?? [])
        setLoading(false)
      })
    return () => { ok = false }
  }, [limit])

  return { data, loading, error }
}

export function usePost(slug: string) {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let ok = true
    supabase.from('posts')
      .select('*')
      .eq('is_published', true)
      .ilike('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (!ok) return
        if (error) setError(error.message)
        setData(data ?? null)
        setLoading(false)
      })
    return () => { ok = false }
  }, [slug])

  return { data, loading, error }
}

export function useProjects() {
  const [data, setData] = useState<any[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let ok = true
    supabase.from('projects')
      .select('id,slug,name,one_liner,cover_url,links,published_at,created_at,details_md')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .then(({ data, error }) => {
        if (!ok) return
        if (error) setError(error.message)
        setData(data ?? [])
        setLoading(false)
      })
    return () => { ok = false }
  }, [])

  return { data, loading, error }
}

export function useProject(slug: string) {
  const [data, setData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    let ok = true
    supabase.from('projects')
      .select('*')
      .eq('is_published', true)
      .ilike('slug', slug)
      .single()
      .then(({ data, error }) => {
        if (!ok) return
        if (error) setError(error.message)
        setData(data ?? null)
        setLoading(false)
      })
    return () => { ok = false }
  }, [slug])

  return { data, loading, error }
}